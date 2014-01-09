var Element = (function() {

  var ElementConstr = function(I) {
    var prop,
        updates = [];

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.width = 100;
    this.height = 100;
    this.drawPosition = 'center';
    Object.defineProperty(this, 'scale', {
      get: function() { return this.scaleX; },
      set: function(scale) {
        var scaleRatio = this.scaleY / this.scaleX;
        this.scaleX = scale;
        this.scaleY = scale * scaleRatio;
      }
    })

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

    this.addLinearTransform = function(props, frames) {
      var thisUpdate,
          startFrame = this.stage.frame;

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
