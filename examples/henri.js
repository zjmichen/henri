var Buffer = function(width, height) {
  return (function(width, height) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer.getContext('2d');
  })(width, height);
};var Debug = function(stage, priv) {
  var eventDrawQ = [];

  this.draw = {
    grid: false,
    outlines: false,
    focus: false,
    framecount: false,
    events: false,
  };

  this.priv = priv;

  this.stage = stage;

  this.addEvent = function(x, y) {
    eventDrawQ.push({x: x, y: y, ttl: 50});
  };

  this.drawBelow = function(ctx) {
    if (this.draw.grid) {
      this.drawGrid(ctx);
    }
  };

  this.drawAbove = function(ctx) {
    if (this.draw.framecount) {
      this.drawFramecount(ctx, this.stage.frame);
    }
    if (this.draw.events) {
      this.drawEvents(ctx);
    }
    if (this.draw.focus) {
      this.drawFocus(ctx);
    }
  }

  this.drawGrid = function(ctx) {
    var width = ctx.canvas.width,
        height = ctx.canvas.height,
        tenColor = 'rgba(127, 127, 255, 0.5)',
        fiftyColor = 'rgba(0, 0, 255, 0.5)',
        hundredColor = 'rgba(0, 0, 255, 0.8)';

    for (i = 0; i < width; i+=10) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = tenColor;

      if (i % 50 === 0) {
        ctx.strokeStyle = fiftyColor;
      }
      if (i % 100 === 0) {
        ctx.strokeStyle = hundredColor;
      }

      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);

      ctx.stroke();
      ctx.restore();
    }

    for (i = 0; i < height; i += 10) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.lineWidth = 1;
      ctx.strokeStyle = tenColor;

      if (i % 50 === 0) {
        ctx.strokeStyle = fiftyColor;
      }
      if (i % 100 === 0) {
        ctx.strokeStyle = hundredColor;
      }

      ctx.moveTo(0, i);
      ctx.lineTo(width, i);

      ctx.stroke();
      ctx.restore();
    }
  };

  this.drawFocus = function(ctx) {
    if (priv.hasFocus) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    }
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, this.stage.width, this.stage.height);
  };

  this.drawFramecount = function(ctx, frame) {
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textBaseline = 'top';
    ctx.fillText(frame, 8, 8);
  };

  this.drawEvents = function(ctx) {
    eventDrawQ.forEach(function(p) {
      var opacity = p.ttl / 50;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 135, 135, ' + opacity + ')';
      ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
      ctx.fill();

      p.ttl--;
      if (p.ttl <= 0) {
        eventDrawQ.splice(p, 1);
      }
    });
  };

  this.drawOutline = function(ctx, el, img) {
    ctx.lineWidth = 2 / el.scale;
    ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
    ctx.strokeRect(0, 0, img.width, img.height);
  };

};
var Element = (function() {

  var ElementConstr = function(I) {
    var prop,
        updates = [],
        realWidth = 100,
        realHeight = 100;

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.drawPosition = 'center';
    this.width = 100;
    this.height = 100;
    if (this.realWidth === undefined) {
      Object.defineProperty(this, 'realWidth', {
        get: function() { return realWidth; },
        set: function(w) {
          this.scaleX = w / this.render().width;
          realWidth = w;
        }
      });
    }
    if (this.realHeight === undefined) {
      Object.defineProperty(this, 'realHeight', {
        get: function() { return realHeight; },
        set: function(h) {
          this.scaleY = h / this.render().height;
          realHeight = h;
        }
      });
    }
    if (this.scale === undefined) {
      Object.defineProperty(this, 'scale', {
        get: function() { return this.scaleX; },
        set: function(scale) {
          var scaleRatio = this.scaleY / this.scaleX;
          this.scaleX = scale;
          this.scaleY = scale * scaleRatio;
        }
      });
    }

    this.update = function() {
    };

    this.render = function() {
      var b = new Buffer(this.width, this.height);
      b.clearRect(0, 0, this.width, this.height);
      b.fillStyle = 'black';
      b.fillRect(0, 0, this.width, this.height);

      return b.canvas;
    };

    this.moveTo = function(x, y, frames) {
      this.addLinearTransform({x: x, y: y}, frames);
    };

    this.scaleTo = function(scaleX, scaleY, frames) {
      if (frames === undefined) {
        frames = scaleY;
        scaleY = scaleX * (this.scaleY / this.scaleX);
      }

      this.addLinearTransform({scaleX: scaleX, scaleY: scaleY}, frames);
    };

    this.resizeTo = function(w, h, frames) {
      if (frames === undefined) {
        frames = h;
        h = w * (this.height / this.width);
      }

      this.addLinearTransform({realWidth: w, realHeight: h}, frames);
    };

    this.addLinearTransform = function(props, frames, blocking) {
      var thisUpdate,
          startFrame = this.stage.frame;

      if (blocking === undefined) {
        blocking = false;
      }

      if (isNaN(frames)) {
        frames = 1;
      }

      thisUpdate = function() {
        var prop,
            framesLeft = (startFrame + frames) - this.stage.frame;

        if (this.stage.frame >= startFrame + frames) {
          if (thisUpdate.prevUpdate !== undefined) {
            thisUpdate.prevUpdate.nextUpdate = thisUpdate.nextUpdate;
          } else {
            this.update = thisUpdate.nextUpdate;
          }
        } else {
          for (prop in props) {
            if (this[prop] !== undefined) {
              this[prop] += (props[prop] - this[prop]) / framesLeft;
              if (!blocking) {
                thisUpdate.nextUpdate.call(this);
              }
            }
          }
        }
      };

      thisUpdate.nextUpdate = this.update;
      thisUpdate.nextUpdate.prevUpdate = thisUpdate;

      this.update = thisUpdate;
    };

    for (prop in I) {
      this[prop] = I[prop];
    }
  };

  return ElementConstr;
})();
function Layer(width, height) {
  this.buffer = new Buffer(width, height);
  this.elements = [];
  this.width = width;
  this.height = height;
}
var Sprite = (function() {
  var blankBuffer = new Buffer(1, 1);

  return function() {
    var modes = { normal: [] },
        mode = 'normal',
        frame = 0,
        skips = 0;

    this.skipFrames = 5;

    this.setMode = function(m) {
      mode = m;
      frame = 0;
    };

    this.getMode = function() {
      return mode;
    };

    this.update = function() {
      skips = (skips + 1) % this.skipFrames;

      if (skips === 0 && modes[mode] && modes[mode].length > 0) {
        frame = (frame + 1) % modes[mode].length;
      }
    };

    this.render = function() {
      if (modes[mode] && modes[mode].length > 0) {
        return modes[mode][frame];
      } else {
        return blankBuffer.canvas;
      }
    };

    this.addImage = function(mode, url) {
      var img = new Image();

      if (modes[mode] === undefined) {
        modes[mode] = [];
      }

      img.addEventListener('load', function() {
        modes[mode].push(img);
      });
      img.src = url;
    };
  };

})();
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
          i, frameDiff, length;

      for (i = lastKeyFrame; i >= 0; i--) {
        if (priv.keyFrames[i] !== undefined) {
          break;
        }
        lastKeyFrame = i;
      }

      length = frameWhen - lastKeyFrame;

      if (priv.keyFrames[frameWhen] === undefined) {
        priv.keyFrames[frameWhen] = [];
      }

      priv.keyFrames[frameWhen].push({
        obj: obj,
        state: state,
        length: length
      });

      this.at(lastKeyFrame, function() {
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