var Element = (function() {

  var ElementConstr = function(I) {
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.scale = 1;
    this.width = 100;
    this.height = 100;

    this.update = function() {
      console.info('No update for ' + this);
    };

    this.render = function() {
      var b = new Buffer(this.width, this.height);
      b.fillStyle = 'black';
      b.fillRect(0, 0, this.width, this.height);

      return b.canvas;
    };
  };

  return ElementConstr;
})();
