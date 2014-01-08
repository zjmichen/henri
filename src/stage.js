var Stage = (function() {

  var StageConstr = function(canvas, debugEnabled) {
    var that = this,
        loop, 
        layers = [],
        ats = [],
        events = {},
        mainCtx = canvas.getContext('2d'),
        backBuf,
        hasFocus = false,
        debug,
        catchEvent;

    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;
    this.frame = 0;
    this.toroidial = false;

    debug = new Debug({
      canvas: canvas,
      loop: loop,
      layers: layers,
      ats: ats,
      events: events,
      hasFocus: hasFocus
    });
    if (debugEnabled) {
      this.debug = debug;
    }

    layers.push(new Layer(this.width, this.height));

    document.addEventListener('click', function(evt) {
      if (evt.target === canvas) {
        hasFocus = true;
      } else {
        hasFocus = false;
      }
    });

    backBuf = new Buffer(this.width, this.height);

    this.addElement = function(layer, ElementType, I) {
      var el, evtName;

      if (layer >= layers.length) {
        layers.push(new Layer(this.width, this.height));
        layer = layers.length - 1;
      }

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.stage = this;
      el.removeFromStage = function() {
        layers[layer].elements.splice(Layers[layer].elements.indexOf(el), 1);
      };

      for (evtName in el.events) {
        this.addEventListener(evtName, el.events[evtName]);
      }

      layers[layer].elements.push(el);

      return el;
    };

    this.start = function() {
      var that = this,
          delay = 1000 / this.frameRate;

      loop = setInterval(function() {
        that.update();
        that.draw();
      }, delay);
    };

    this.stop = function() {
      clearInterval(loop);
    };

    this.at = function(frameWhen, callback) {
      if (ats[frameWhen] === undefined) {
        ats[frameWhen] = [];
      }

      ats[frameWhen].push(callback);
    };

    this.addEventListener = function(evtName, callback) {
      if (events[evtName] === undefined) {
        events[evtName] = [];

        if (/key/i.test(evtName)) {
          document.addEventListener(evtName, catchEvent);
        } else {
          canvas.addEventListener(evtName, catchEvent);
        }
      }

      events[evtName].push(callback);
    };

    this.update = function() {
      if (ats[this.frame] !== undefined) {
        ats[this.frame].forEach(function(callback) {
          callback();
        });
        delete ats[this.frame];
      }

      layers.forEach(function(layer) {
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

      if (debug.draw.grid) {
        debug.drawGrid(backBuf);
      }
      if (debug.draw.focus) {
        if (hasFocus) {
          backBuf.strokeStyle = 'yellow';
          backBuf.lineWidth = 4;
          backBuf.strokeRect(0, 0, this.width, this.height);
        } else {
          backBuf.strokeStyle = 'gray';
          backBuf.lineWidth = 4;
          backBuf.strokeRect(0, 0, this.width, this.height);
        }
      }

      layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          var x = el.x,
              y = el.y,
              img;

          if (this.toroidial) {
            x = ((x % this.width) + this.width) % this.width;
            y = ((y % this.height) + this.height) % this.height;
          }

          backBuf.save();
          backBuf.translate(x, y);
          backBuf.rotate(el.angle);
          backBuf.scale(el.scale, el.scale);

          img = el.render();

          if (el.drawPosition === 'center') {
            backBuf.translate(-0.5*img.width, -0.5*img.height);
          }
          backBuf.drawImage(img, 0, 0);

          if (debug.draw.outlines) {
            backBuf.lineWidth = 2 / el.scale;
            backBuf.strokeStyle = 'rgba(255, 100, 0, 0.8)';
            backBuf.strokeRect(0, 0, img.width, img.height);
          }

          backBuf.restore();
        }.bind(this));
      }.bind(this));

      if (debug.draw.framecount) {
        debug.drawFramecount(backBuf, this.frame);
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

    catchEvent = function(evt) {
      if (events[evt.type] === undefined) {
        console.warn('Tried to process event with no handler: ' + evt.type);
      } else if (!/key/i.test(evt.type) || hasFocus ) {
        evt.canvasX = evt.pageX - canvas.offsetLeft;
        evt.canvasY = evt.pageY - canvas.offsetTop;

        events[evt.type].forEach(function(handler) {
          handler(evt);
        });
      }
    };

  };

  return StageConstr;
})();