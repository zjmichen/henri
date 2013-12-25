function Element(ElementType, I) {
  ElementType.prototype = this;

  this.sprite = I.sprite || new Sprite();
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
