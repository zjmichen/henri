window.onload = function() {
  var s = new Stage(document.getElementById('example'));

  var e = s.addElement(Ship, {});
  var f = s.addElement(Ship, {x: 30});

  f.angle = Math.PI * 0.25;
  f.x = 100;
  f.y = 300;
  f.scale = 0.5;

  f.update = function() {
    this.scale += 0.005*Math.sin(0.05*this.stage.frame);
  };

  s.start();

  window.f = f;
}

var Ship = function() {
  var b = new Buffer(this.width, this.height);
  this.type = 'ship';

  this.x = 250;
  this.y = 200;

  this.render = function() {
    b.clearRect(0, 0, this.width, this.height);

    b.fillRect(0, 0, this.width, this.height);

    return b.canvas;
  };
};