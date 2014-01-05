Henri
=====

A fun 2d HTML5 canvas library.

Usage
-----

### Basic Use

Include all the files in src/ in your html. I cat them together with
`cat src/*.js > examples/henri.js` and then include that.

Initialize the stage:

```javascript
window.onload = function() {
  var s = new Stage(document.getElementById('myCanvas'));

```

Boom, initialized. You probably want stuff in there, so you can do  this:

```javascript
  var a = s.addElement(0, Asteroid, {x: 100, y: 100});
```

where `Asteroid` is an object constructor that you define. The first parameter
denotes which layer to put the element in; layers stack up from zero. If you ask
to add an element to a layer higher than the highest layer, a new layer is
added with the next available number (not necessarily the one you specified).

All stage elements
automatically inherit a few things:  the properties x, y, angle, scale, width,
height, and stage; and the methods update, render, and removeFromStage. These do
what you might expect. You get back a reference to the element in case you want
to customize it.

- `x` and `y` define the center of the object.
- `render` must return an image element (i.e. something you can pass to
  CanvasRenderingContext2D.drawImage). By default it gives a big black rectangle
  where the element is.

When everything is set up, you can start things off:

```javascript
  s.start();
};
```

The `Stage` object has the following attributes:  properties width, height,
frameRate, and frame; and methods start, stop, and addElement.

### Sprites

Rather than doing a bunch of canvas manipulation, it's usually easier to use a
sprite. A helper object is included for this reason. Let's use a sprite for our
asteroid rather than a black box:

```javascript
var Asteroid = function() {
  this.width = 50;  // best to be the same size as the sprite images
  this.height = 50;

  this.sprite = new Sprite();
  this.sprite.addImage('normal', 'asteroid1.png');
  this.sprite.addImage('normal', 'asteroid2.png');

  this.sprite.addImage('exploding', 'explosion1.png');
  this.sprite.addImage('exploding', 'explosion2.png');
  this.sprite.addImage('exploding', 'explosion3.png');

  this.update = function() {
    if (this.shouldExplode) {
      this.sprite.setMode('exploding');
    }

    this.sprite.update();
  };

  this.render = function() {
    return this.sprite.render();
  };
};
```

A couple of things to note here:

- We have to make sure we update the sprite, otherwise it will appear stuck on
  one image.
- We use the sprite's image as our render image.
- Sprites have 'modes', which each have a series of images that are displayed in
  sequence when the sprite is in that mode. The default mode is 'normal', which
  is empty at first. To create a new mode, simply add images with that mode
  specified.