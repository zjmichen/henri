function Sprite(I) {
  I = I || {};
  var width = I.width || 10
    , height = I.height || 10
    , buffer = new Buffer(width, height)
    , modes = I.modes || {}
    , mode = 'default'
    , modeFrame = 0
    , frame = 0
    , frameSkip = 3
    ;

  this.setMode = function(m) {
    mode = m;
    modeFrame = 0;
    buffer.drawImage(modes[mode][modeFrame], 0, 0);
  };

  this.getImage = function() {
    return buffer.canvas;
  };

  this.update = function() {
    frame = frame++ % frameSkip;

    if (frame === 0) {
      modeFrame = modeFrame++ % modes[mode].length;
      buffer.drawImage(modes[mode][modeFrame], 0, 0);
    }
  };
}
