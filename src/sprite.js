function Sprite(I) {
  I = I || {};
  var that = this
    , width = I.width || 10
    , height = I.height || 10
    , buffer = new Buffer(width, height)
    , mode = 'normal'
    , modeFrame = 0
    , frame = 0
    , frameSkip = 30
    ;

  modes = I.modes || {'normal': []};

  this.setMode = function(m) {
    mode = m;
    modeFrame = 0;
    buffer = modes[mode][modeFrame];
  };

  this.getImage = function() {
    return buffer;
  };

  this.update = function() {
    if (frame === 0) {
      modeFrame = (modeFrame + 1) % modes[mode].length;
      buffer = modes[mode][modeFrame];
    }

    frame = (frame + 1) % frameSkip;
  };

  this.addSource = function(modeName, buffer) {
    modes[modeName] = modes[modeName] || [];
    modes[modeName].push(buffer);
  };

  this.addSourcesByUrl = function(modeName, urls) {
    modes[modeName] = modes[modeName] || [];
    urls.forEach(function(url) {
      var img = new Image();
      img.addEventListener('load', function() {
        that.addSource(modeName, img);
      });
      img.src = url;
    });
  };
}
