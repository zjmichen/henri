window.onload = function() {
  console.log("Hello!");

  var s = new Sprite({
    width: 100,
    height: 100
  });

  var canvas = document.getElementById('counter')
    , ctx = canvas.getContext('2d');

  s.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);

  window.setInterval(function() {
    s.update();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 300, 150);
    ctx.drawImage(s.getImage(), 0, 0);
  }, 100);

};
