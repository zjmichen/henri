window.onload = function() {
  var canvas = document.getElementById('counter')
    , ctx = canvas.getContext('2d');

  var stage = new Stage(canvas);
  stage.addElement(Explosion, {x: 0, y: 0});
  stage.addElement(Explosion, {x: 50, y: 0});
  stage.addElement(Explosion, {x: 100, y: 0});

  stage.start();
};

function Explosion(I) {
  this.x = I.x || 0;
  this.y = I.y || 0;
  this.sprite = new Sprite();
  this.sprite.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);
}
