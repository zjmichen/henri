function Sprite(I) {
  I = I || {};

  var width = I.width || 10
    , height = I.height || 10
    , blankBuffer = new Buffer(width, height)
    ;

  return (function(I) {
    I = (typeof I !== 'object') ? {} : I;

    var _sprite
      , image = blankBuffer.canvas
      , mode = 'normal'
      , modeFrame = 0
      , frame = 0
      , frameSkip = 10
      , modes = I.modes || {'normal': []};
      ;

    _sprite = {
      setMode: function(m) {
        if (modes.hasOwnProperty(m)) {
          mode = m;
          modeFrame = 0;
          image = (modes[mode].length > 0) ?
              modes[mode][modeFrame] :
              blankBuffer.canvas;
        }
      },

      getImage: function() { return image; },

      update: function() {
        if (frame === 0) {
          if (modes[mode].length > 0) {
            modeFrame = (modeFrame + 1) % modes[mode].length;
            image = modes[mode][modeFrame];
          }
        }

        frame = (frame + 1) % frameSkip;
      },

      addImages: function(modeName, images) {
        modes[modeName] = modes[modeName] || [];
        images.forEach(function(image) {
          modes[modeName].push(image);
        });
      },

      addImagesByUrl: function(modeName, urls) {
        var that = this;

        modes[modeName] = modes[modeName] || [];
        urls.forEach(function(url) {
          var img = new Image();
          img.addEventListener('load', function() {
            that.addImages(modeName, [img]);
          });
          img.src = url;
        });
      }
    };

    return _sprite;
  })();
}
