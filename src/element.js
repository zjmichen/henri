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
