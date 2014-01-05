var Element = (function() {

  var ElementConstr = function(I) {
    var prop;

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
      var _update = this.update,
          dx = (x - this.x) / frames,
          dy = (y - this.y) / frames;

      this.update = function() {
        if (this.x === x && this.y === y) {
          this.update = _update;
        } else {
          this.x += dx;
          this.y += dy;
          _update.call(this);
        }
      };
    };

    for (prop in I) {
      this[prop] = I[prop];
    }
  };

  return ElementConstr;
})();
