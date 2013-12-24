function Element(prototype) {
  this.prototype = prototype;
  sprite = new Sprite(prototype.sprite);

  this.update = function() {
    sprite.update();
  };

  this.render = function() {
    return sprite.getImage();
  };
}
