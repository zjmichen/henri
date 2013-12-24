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

