function Sprite(I) {
  I = I || {};
  var that = this
    , width = I.width || 10
    , height = I.height || 10
    , buffer = new Buffer(width, height)
    , mode = 'normal'
    , modeFrame = 0
    , frame = 0
    , frameSkip = 3
    ;

  this.modes = I.modes || {'normal': []};

  this.setMode = function(m) {
    mode = m;
    modeFrame = 0;
    buffer = this.modes[mode][modeFrame];
  };

  this.getImage = function() {
    return buffer;
  };

  this.update = function() {
    frame = frame++ % frameSkip;

    if (frame === 0) {
      modeFrame = (modeFrame + 1) % this.modes[mode].length;
      buffer = this.modes[mode][modeFrame];
    }
  };

  this.addSource = function(modeName, buffer) {
    this.modes[modeName] = this.modes[modeName] || [];
    this.modes[modeName].push(buffer);
  };

  this.addSourcesByUrl = function(modeName, urls) {
    this.modes[modeName] = this.modes[modeName] || [];
    urls.forEach(function(url) {
      var img = new Image();
      img.addEventListener('load', function() {
        that.addSource(modeName, img);
      });
      img.src = url;
    });
  };
}
