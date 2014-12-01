var Henri = (function(Henri) {

  Henri.Layer = function(width, height) {
    this.buffer = new Henri.Buffer(width, height);
    this.elements = [];
    this.width = width;
    this.height = height;
  };

  return Henri;
})(Henri || {});
