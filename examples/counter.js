window.onload = function() {
  var canvas = document.getElementById('counter')
    , ctx = canvas.getContext('2d');

  var e = new Element(Explosion);

  window.setInterval(function() {
    e.update();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 300, 150);
    ctx.drawImage(e.render(), 0, 0);
  }, 500);
};

function Explosion() {
  this.sprite = new Sprite();
  this.sprite.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);
}
