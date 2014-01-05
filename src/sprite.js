var Sprite = (function() {
  var blankBuffer = new Buffer(1, 1);

  return function(width, height) {
    var modes = { normal: [] },
        mode = 'normal',
        frame = 0,
        skips = 0;

    this.width = width;
    this.height = height;
    this.skipFrames = 3;

    this.setMode = function(m) {
      if (modes.hasOwnProperty(m)) {
        mode = m;
        frame = 0;
      }
    };

    this.update = function() {
      skips = (skips + 1) % this.skipFrames;

      if (skips === 0 && modes[mode].length > 0) {
        frame = (frame + 1) % modes[mode].length;
      }
    };

    this.render = function() {
      if (modes[mode].length > 0) {
        return modes[mode][frame];
      } else {
        return blankBuffer.canvas;
      }
    };

    this.addImage = function(mode, url) {
      var img = new Image();

      img.addEventListener('load', function() {
        modes[mode].push(img);
      });
      img.src = url;

    };
  };

})();
