var Stage = (function() {

  var StageConstr = function(canvas, debugEnabled) {
    var that = this,
        priv = {
          layers: [],
          ats: [],
          keyFrames: [],
          events: {},
          hasFocus: false,
          loop: undefined,
          canvas: canvas
        },
        mainCtx = canvas.getContext('2d'),
        backBuf,
        debug,
        catchEvent;

    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;
    this.frame = 0;
    this.toroidial = false;
    this.running = false;
    this.socket = undefined;
    this.socketEnabled = false;

    debug = new Debug(this, priv);
    if (debugEnabled) {
      this.debug = debug;
    }

    priv.layers.push(new Layer(this.width, this.height));

    document.addEventListener('click', function(evt) {
      if (evt.target === canvas) {
        priv.hasFocus = true;
      } else {
        priv.hasFocus = false;
      }
    });

    backBuf = new Buffer(this.width, this.height);

    this.addElement = function(layer, ElementType, I) {
      var el, evtName;

      if (layer >= priv.layers.length) {
        priv.layers.push(new Layer(this.width, this.height));
        layer = priv.layers.length - 1;
      }

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.stage = this;
      el.removeFromStage = function() {
        priv.layers[layer].elements.splice(priv.layers[layer].elements.indexOf(el), 1);
      };
      el.type = ElementType;
      el.defaults = I;

      for (evtName in el.events) {
        this.addEventListener(evtName, el.events[evtName]);
      }

      priv.layers[layer].elements.push(el);

      return el;
    };

    this.start = function() {
      var that = this,
          delay = 1000 / this.frameRate;

      if (this.running === false) {
        priv.loop = setInterval(function() {
          that.update();
          that.draw();
        }, delay);
      }
      this.running = true;
    };

    this.stop = function() {
      clearInterval(priv.loop);
      this.running = false;
    };

    this.at = function(frameWhen, callback) {
      if (priv.ats[frameWhen] === undefined) {
        priv.ats[frameWhen] = [];
      }

      priv.ats[frameWhen].push(callback);
    };

    this.removeAt = function(frameWhen, cbNum) {
      if (priv.ats[frameWhen] !== undefined) {
        priv.ats[frameWhen].splice(cbNum, 1);
      }
    };

    this.addKeyFrame = function(frameWhen, obj, state) {
      var lastKeyFrame = Math.max(frameWhen - 1, 0),
          i, frameDiff;

      for (i = lastKeyFrame; i >= 0; i--) {
        if (priv.keyFrames[i] !== undefined) {
          break;
        }
        lastKeyFrame = i;
      }

      length = frameWhen - lastKeyFrame;

      console.log(lastKeyFrame + ' + '  + length + ' = ' + frameWhen);

      if (priv.keyFrames[frameWhen] === undefined) {
        priv.keyFrames[frameWhen] = [];
      }

      priv.keyFrames[frameWhen].push({
        obj: obj,
        state: state,
        length: length
      });

      this.at(lastKeyFrame, function() {
        console.log("Transforming to keyframe " + frameWhen);
        console.log(state);
        obj.addLinearTransform(state, length);
      });
    };

    this.addEventListener = function(evtName, callback) {
      if (priv.events[evtName] === undefined) {
        priv.events[evtName] = [];

        if (/key/i.test(evtName)) {
          document.addEventListener(evtName, catchEvent);
        } else {
          canvas.addEventListener(evtName, catchEvent);
        }
      }

      priv.events[evtName].push(callback);
    };

    this.initSocket = function(io, server, logMessages) {
      this.socket = io.connect(server);

      if (logMessages) {
        this.socket.on('message', function(msg) {
          console.log(msg);
        });
      }

      this.socketEnabled = true;
    };

    this.update = function() {
      if (priv.ats[this.frame] !== undefined) {
        priv.ats[this.frame].forEach(function(callback) {
          callback();
        });
      }

      priv.layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          el.update();
        });
      });

      this.frame++;
    }.bind(this);

    this.draw = function() {
      var i;
      mainCtx.clearRect(0, 0, this.width, this.height);
      backBuf.clearRect(0, 0, this.width, this.height);

      if (debugEnabled) {
        debug.drawBelow(backBuf);
      }

      priv.layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          var img;

          if (this.toroidial) {
            el.x = ((el.x % this.width) + this.width) % this.width;
            el.y = ((el.y % this.height) + this.height) % this.height;
          }

          backBuf.save();
          backBuf.translate(el.x, el.y);
          backBuf.rotate(el.angle);
          backBuf.scale(el.scaleX, el.scaleY);

          img = el.render();

          if (el.drawPosition === 'center') {
            backBuf.translate(-0.5*img.width, -0.5*img.height);
          }
          backBuf.drawImage(img, 0, 0);

          if (debug.draw.outlines) {
            debug.drawOutline(backBuf, el, img);
          }

          backBuf.restore();
        }.bind(this));
      }.bind(this));

      if (debugEnabled) {
        this.debug.drawAbove(backBuf);
      }

      mainCtx.drawImage(backBuf.canvas, 0, 0);
    }.bind(this);

    this.setDebug = function(opts) {
      if (!debugEnabled) { return; }

      for (var type in opts) {
        if (debug.draw.hasOwnProperty(type)) {
          debug.draw[type] = (opts[type]) ? true : false;
        }
      }
    };

    this.reset = function() {
      priv.layers.forEach(function(layer, layerNum) {
        layer.elements.forEach(function(el) {
          Element.call(el, el.defaults);
          el.type.call(el, el.defaults);
        });
      });

      this.frame = 0;
    };

    this.goToFrame = function(f) {
      var i;
      this.reset();
      for (i = 0; i < f; i++) {
        this.update();
      }

      this.draw();
    };

    catchEvent = function(evt) {
      if (!that.running) { return; }

      if (priv.events[evt.type] === undefined) {
        console.warn('Tried to process event with no handler: ' + evt.type);
      } else if (!/key/i.test(evt.type) || priv.hasFocus ) {
        evt.canvasX = evt.pageX - canvas.offsetLeft;
        evt.canvasY = evt.pageY - canvas.offsetTop;

        if (debugEnabled) {
          debug.addEvent(evt.canvasX, evt.canvasY);
        }

        priv.events[evt.type].forEach(function(handler) {
          handler(evt);
        });
      }

      evt.stopPropagation();
      if (!evt.ctrlKey && !evt.altKey) {
        evt.preventDefault();
      }
    };

  };

  return StageConstr;
})();