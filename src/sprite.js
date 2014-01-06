var Sprite = (function() {
  var blankBuffer = new Buffer(1, 1);

  return function() {
    var modes = { normal: [] },
        mode = 'normal',
        frame = 0,
        skips = 0;

    this.skipFrames = 5;

    this.setMode = function(m) {
      mode = m;
      frame = 0;
    };

    this.getMode = function() {
      return mode;
    };

    this.update = function() {
      skips = (skips + 1) % this.skipFrames;

      if (skips === 0 && modes[mode] && modes[mode].length > 0) {
        frame = (frame + 1) % modes[mode].length;
      }
    };

    this.render = function() {
      if (modes[mode] && modes[mode].length > 0) {
        return modes[mode][frame];
      } else {
        return blankBuffer.canvas;
      }
    };

    this.addImage = function(mode, url) {
      var img = new Image();

      if (modes[mode] === undefined) {
        modes[mode] = [];
      }

      img.addEventListener('load', function() {
        modes[mode].push(img);
      });
      img.src = url;
    };
  };

})();
