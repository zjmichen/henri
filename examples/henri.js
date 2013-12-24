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

function Element(ElementType, I) {
  ElementType.prototype = this;

  this.sprite = I.sprite || {};
  this.x = I.x || 0;
  this.y = I.y || 0;

  this.update = function() {
    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.getImage();
  };

  return new ElementType(I);
}
window.onload = function() {
  /* create the stage object with the canvas */
  var canvas = document.getElementById('counter')
    , stage = new Stage(canvas);

  /* add some elements to the stage by giving the
   * constructor and some params. here we pass the
   * explosion constructor, which we'll define later */
  stage.addElement(Explosion, {x: 0, y: 0});
  stage.addElement(Explosion, {x: 50, y: 0});

  /* we can get a reference to the added element, to
   * change its behavior */
  var e = stage.addElement(Explosion, {x: 100, y: 0});

  /* the 'update' method of elements determines how they
   * change frame-to-frame.  this one will move a little. */
  e.update = function() {
    this.sprite.update();
    this.y += 0.5*Math.sin(0.01*stage.frameCount);
    this.x += 0.5*Math.cos(0.01*stage.frameCount);
  };

  /* when everything is set up, we start the action */
  stage.start();

};

/* here we define how to create an Explosion element,
 * so we can add some to the stage. element constructors
 * take an initialization object as the only parameter. */
function Explosion(I) {
  /* we'll add a sprite with images we have */
  this.sprite = new Sprite();

  /* the list of images are the frames that will be cycled
   * through, animating the sprite */
  this.sprite.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);
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

  this.frameCount = 0;

  for (i = 0; i < numLayers; i++) {
    layers.push(new Layer(width, height));
  }

  this.start = function() {
    var delay = 1000 / frameRate;
    priv.mainLoop = window.setInterval(function() {
      update();
      draw();
      that.frameCount++;
    }, delay);
  };

  this.stop = function() {
    window.clearInterval(priv.mainLoop);
  };

  this.addElement = function(ElementType, I, layer) {
    var element = new Element(ElementType, I);
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
    bufMain.clearRect(0, 0, width, height);

    layers.forEach(function(layer) {
      layer.buffer.clearRect(0, 0, layer.width, layer.height);

      layer.elements.forEach(function(elem) {
        layer.buffer.drawImage(elem.render(), elem.x, elem.y);
      });

      bufMain.drawImage(layer.buffer.canvas, 0, 0);
    });

    ctxMain.clearRect(0, 0, width, height);
    ctxMain.drawImage(bufMain.canvas, 0, 0);
  };
}
