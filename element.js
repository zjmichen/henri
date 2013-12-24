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
