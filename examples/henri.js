/**
 * This is originally lifted from Mark Crossley's animated HTML5 canvas odometer,
 * http://www.wilmslowastro.com/odometer/odometer.html, which is under the GPLv3
 */
function Buffer(width, height) {
  var buffer = document.createElement('canvas');
  buffer.width = width;
  buffer.height = height;
  return buffer.getContext('2d');
}

function Element(ElementType) {
  ElementType.prototype = this;

  this.sprite = new Sprite(ElementType.sprite);
  this.x = 0;
  this.y = 0;

  this.update = function() {
    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.getImage();
  };

  return new ElementType();
}
function Layer(width, height) {
  this.buffer = new Buffer(width, height);
  this.elements = [];
  this.width = width;
  this.height = height;
}
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
function Stage(canvas, I) {
  I = I || {};

  var that = this
    , priv = {}
    , layers = []
    , ctxMain = canvas.getContext('2d')
    , height = canvas.height
    , width = canvas.width
    , bufMain = new Buffer(width, height)
    , frameRate = I.frameRate || 60
    , numLayers = I.numLayers || 2
    , i
    ;

  for (i = 0; i < numLayers; i++) {
    layers.push(new Layer(width, height));
  }

  this.start = function() {
    var delay = 1000 / frameRate;
    priv.mainLoop = window.setInterval(function() {
      update();
      draw();
    }, delay);
  };

  this.stop = function() {
    window.clearInterval(priv.mainLoop);
  };

  this.addElement = function(ElementType, layer) {
    var element = new Element(ElementType);
    layer = layer || 0;

    layers[layer].elements.push(element);
    element.removeFromStage = function() {
      layers[layer].elements.splice(
          layers[layer].elements.indexOf(element), 1);
    };

    return element;
  };

  var update = function() {
    layers.forEach(function(layer) {
      layer.elements.forEach(function(elem) {
        elem.update();
      });
    });
  };

  var draw = function() {
    layers.forEach(function(layer) {
      layer.elements.forEach(function(elem) {
        layer.buffer.drawImage(elem.render(), elem.x, elem.y);
      });

      bufMain.drawImage(layer.buffer.canvas, 0, 0);
    });

    ctxMain.drawImage(bufMain.canvas, 0, 0);
  };
}
