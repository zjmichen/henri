function Layer(width, height) {
  var buffer = new Buffer(width, height);

  this.ctx = buffer.getContext('2d');
  this.elements = [];
  this.width = width;
  this.height = height;
}
