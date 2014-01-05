var Element = (function() {

  var ElementConstr = function(I) {
    var b;

    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 1;
    this.width = 100;
    this.height = 100;

    b = new Buffer(this.width, this.height);

    this.update = function() {
    };

    this.render = function() {
      b.clearRect(0, 0, this.width, this.height);
      b.fillStyle = 'black';
      b.fillRect(0, 0, this.width, this.height);

      return b.canvas;
    };
  };

  return ElementConstr;
})();
