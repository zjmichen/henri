function Element(ElementType) {
  ElementType.prototype = this;

  this.sprite = new Sprite(ElementType.sprite);

  this.update = function() {
    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.getImage();
  };

  return new ElementType();
}
