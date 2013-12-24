window.onload = function() {
  console.log("Hello!");

  var s = new Sprite({
    width: 100,
    height: 100
  });

  var canvas = document.getElementById('counter')
    , ctx = canvas.getContext('2d');

  var img = new Image();
  img.addEventListener('load', function() {
    s.addSource('normal', img);
    s.update();
    ctx.drawImage(s.getImage(), 0, 0);
  }, false);
  img.src = 'book.bmp';


};
