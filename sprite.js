function Sprite(I) {
  I = I || {};
  var width = I.width || 10
    , height = I.height || 10
    , buffer = new Buffer(width, height)
    , mode = 'default'
    , modeFrame = 0
    , frame = 0
    , frameSkip = 3
    ;

  this.modes = I.modes || {'default': []};

  this.setMode = function(m) {
    mode = m;
    modeFrame = 0;
    buffer.drawImage(this.modes[mode][modeFrame], 0, 0);
  };

  this.getImage = function() {
    return buffer.canvas;
  };

  this.update = function() {
    frame = frame++ % frameSkip;

    if (frame === 0) {
      console.log(this.modes['default'].length);
      //modeFrame = modeFrame++ % this.modes[mode].length;
      //buffer.drawImage(this.modes[mode][modeFrame], 0, 0);
    }
  };

  this.addSource = function(modeName, buffer) {
    this.modes[modeName] = this.modes[modeName] || [];
    this.modes[modeName].push(buffer);
    console.log(modeName);
    console.log(this.modes[modeName].length);
  };
}
