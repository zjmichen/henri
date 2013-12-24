window.onload = function() {
  var canvas = document.getElementById('counter')
    , ctx = canvas.getContext('2d');

  var stage = new Stage(canvas);
  var e = stage.addElement(Explosion);

  stage.start();
};

function Explosion() {
  this.sprite = new Sprite();
  this.sprite.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);
}
