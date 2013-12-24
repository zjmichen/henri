function Counter(canvas) {
  this.prototype = new Stage(canvas);

  var digits = []
    , i
    , digitEl = new DigitElement()
    ;

  for (i = 0; i < 4; i++) {
    digit = stage.addElement(digitEl);
    digit.x = digit.width * i;
    digit.y = 0;
  }
}

function DigitElement() {
  var i, buffer
    , width = 100
    , height = 100
    , sprite = new Sprite({
        width: width,
        height: height
      })
    ;

  for (i = 0; i < 10; i++) {
    buffer = new Buffer(width, height);
    buffer.fillStyle = 'white';
    buffer.fillRect(0, 0, width, height);

    buffer.textAlign = 'center';
    buffer.textBaseline = 'middle';
    buffer.font = 'sans-serif';
    buffer.fillStyle = 'black';
    buffer.fillText(i, width * 0.5, height * 0.5);

    sprite.addSource('default', buffer);
  }
}

window.onload = function() {
  var canvas = document.getElementById('counter')
    , counter = new Counter(canvas);

  counter.start();
};
