window.onload = function() {
  var s = new Stage(document.getElementById('example'));
  s.toroidial = true;

  s.at(500, function() {
    console.log('Hello!');
  });

  var e = s.addElement(Ship, {});
  var f = s.addElement(Ship, {x: 30});
  var b = s.addElement(Bomb, {});
  b.x = 50;
  b.y = 50;

  f.angle = Math.PI * 0.25;
  f.x = 100;
  f.y = 300;
  f.scale = 0.5;

  f.update = function() {
    this.sprite.update();
    this.scale += 0.005*Math.sin(0.05*this.stage.frame);
  };

  f.sprite.setMode('thrusting');

  s.start();

  window.f = f;
}

var Ship = function() {
  this.sprite = new Sprite(this.width, this.height);

  this.sprite.addImage('normal', 'ship_normal.png');
  this.sprite.addImage('thrusting', 'ship_fire1.png');
  this.sprite.addImage('thrusting', 'ship_fire2.png');
  this.sprite.addImage('thrusting', 'ship_fire3.png');

  this.type = 'ship';
  this.x = 250;
  this.y = 200;
  this.width = 150;
  this.height = 64;

  this.update = function() {
    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.render();
  };
};

var Bomb = function() {
  this.sprite = new Sprite(this.width, this.height);
  this.sprite.addImage('normal', 'bomb.png');

  this.width = 15;
  this.height = 15;
  this.direction = 0.25*Math.PI;
  this.speed = 0.5;

  this.update = function() {
    this.sprite.update();
    this.x += this.speed*Math.cos(this.direction);
    this.y += this.speed*Math.sin(this.direction);
  }

  this.render = function() {
    return this.sprite.render();
  }
};
