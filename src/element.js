var Element = (function() {

  var ElementConstr = function(I) {
    var prop,
        updates = [],
        width = 100,
        height = 100;

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.drawPosition = 'center';
    this.width = 100;
    this.height = 100;
    Object.defineProperty(this, 'width', {
      get: function() { return width; },
      set: function(w) {
        this.scaleX = w / this.render().width;
        width = w;
      }
    });
    Object.defineProperty(this, 'height', {
      get: function() { return height; },
      set: function(h) {
        this.scaleY = h / this.render().height;
        height = h;
      }
    });
    Object.defineProperty(this, 'scale', {
      get: function() { return this.scaleX; },
      set: function(scale) {
        var scaleRatio = this.scaleY / this.scaleX;
        this.scaleX = scale;
        this.scaleY = scale * scaleRatio;
      }
    });

    this.update = function() {
    };

    this.render = function() {
      var b = new Buffer(width, height);
      b.clearRect(0, 0, width, height);
      b.fillStyle = 'black';
      b.fillRect(0, 0, width, height);

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

      this.addLinearTransform({width: w, height: h}, frames);
    };

    this.addLinearTransform = function(props, frames) {
      var thisUpdate,
          startFrame = this.stage.frame;

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
              thisUpdate.nextUpdate.call(this);
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
