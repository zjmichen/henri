window.onload = function() {
  var canvas = document.getElementById('clock')
    , stage = new Stage(canvas);

  var e = stage.addElement(Explosion, {x: 50, y: 0});

  stage.start();
};

function Explosion(I) {
  var b = new Buffer(50, 50);
  b.fillStyle = 'black';
  b.fillRect(10, 10, 30, 30);

  this.sprite = new Sprite();
  this.sprite.addImages('normal', [b.canvas]);

  this.update = function() {
    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.getImage();
  };
}

