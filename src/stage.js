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

  this.addElement = function(ElementSpec, I, layer) {
    var element;

    var ElementConstructor = function() {
      var prop;
      for (prop in I) {
        this[prop] = I[prop];
      }

      this.init(I);
    };

    ElementConstructor.prototype = new Element(ElementSpec);
    ElementConstructor.prototype.constructor = ElementConstructor;

    element = new ElementConstructor(I);
    console.log(element);

    layer = (typeof layer === 'undefined') ? 0 : layer;
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
