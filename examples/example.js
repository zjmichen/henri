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
  var sprite = new Sprite(this.width, this.height);

  sprite.addImage('normal', 'ship_normal.png');

  this.type = 'ship';
  this.x = 250;
  this.y = 200;
  this.width = 150;
  this.height = 64;

  this.update = function() {
    sprite.update();
  };

  this.render = function() {
    return sprite.render();
  };
};