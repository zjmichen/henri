var Element = (function() {
  function ElementConstructor(I) {
    var prop;
    I = (typeof I !== 'object') ? {} : I;
    this.x = 0;
    this.y = 0;
    this.sprite = new Sprite();

    for (prop in I) {
      this[prop] = I[prop];
    }
  }

  ElementConstructor.prototype = {
    constructor: ElementConstructor,

    type: 'Element',

    init: function(I) {
    },

    update: function() {
      this.sprite.update();
    },

    render: function() {
      return this.sprite.getImage();
    }
  };

  return ElementConstructor;
})();
