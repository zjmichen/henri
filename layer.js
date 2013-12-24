function Layer(width, height) {
  this.buffer = new Buffer(width, height);
  this.elements = [];
  this.width = width;
  this.height = height;
}
