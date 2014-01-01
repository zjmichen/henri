window.onload = function() {
  var canvas = document.getElementById('clock')
    , stage = new Stage(canvas);

  stage.addElement(Explosion, {name: 'tom'});
  var e = stage.addElement(Explosion, {name: 'tom', x: 100});

  var b = new Buffer(50, 50);
  b.fillStyle = 'black';
  b.fillRect(0, 0, 50, 50);

  e.sprite.addImages('normal', [b.canvas]);

  stage.start();
};

var Explosion = {
  type: 'Explosion',
  x: 30,
  y: 30,
  name: 'unnamed',
  init: function(I) {
    var s = new Sprite();
    s.addImagesByUrl('normal', ['explosion1.png', 'explosion2.png']);
    this.sprite = s;
  }
};
