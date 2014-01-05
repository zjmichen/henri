var Element = (function() {

  var ElementConstr = function(I) {
    var prop,
        updates = [];

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 1;
    this.width = 100;
    this.height = 100;
    this.drawPosition = 'center';

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
      var dx = (x - this.x) / frames,
          dy = (y - this.y) / frames,
          endFrame = this.stage.frame + frames,
          nextUpdate = this.update;

      console.log("Move to " + x + ", " + y + " will complete at " + endFrame);

      this.update = function() {
        if (this.stage.frame >= endFrame) {
          nextUpdate.call(this);
        }  else {
          this.x += dx;
          this.y += dy;
          nextUpdate.call(this);
        }
      }
    };

    for (prop in I) {
      this[prop] = I[prop];
    }
  };

  return ElementConstr;
})();
