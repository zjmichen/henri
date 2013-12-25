function Sprite(I) {
  I = I || {};
  var that = this
    , width = I.width || 10
    , height = I.height || 10
    , blankBuffer = new Buffer(width, height)
    , image = blankBuffer.canvas
    , mode = 'normal'
    , modeFrame = 0
    , frame = 0
    , frameSkip = 10
    ;

  modes = I.modes || {'normal': []};

  this.setMode = function(m) {
    if (modes.hasOwnProperty(m)) {
      mode = m;
      modeFrame = 0;
      image = (modes[mode].length > 0) ?
          modes[mode][modeFrame] :
          blankBuffer.canvas;
    }
  };

  this.getImage = function() {
    return image;
  };

  this.update = function() {
    if (frame === 0) {
      if (modes[mode].length > 0) {
        modeFrame = (modeFrame + 1) % modes[mode].length;
        image = modes[mode][modeFrame];
      }
    }

    frame = (frame + 1) % frameSkip;
  };

  this.addImages = function(modeName, images) {
    modes[modeName] = modes[modeName] || [];
    images.forEach(function(image) {
      modes[modeName].push(image);
    });
  };

  this.addImagesByUrl = function(modeName, urls) {
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
