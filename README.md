Henri
=====

A better 2d HTML5 canvas library.

Usage
-----

First, you have to include the sources in HTML. Later on I'll add a better
build process; for now it's just `cat src/*.js > henri.js`. Then it's the
ol' `<script src='henri.js'></script>`.

### Stage

In your implementation, you first create a Stage, which takes a canvas
HTML element and init object:

  var canvas = document.getElementById('myCanvas')
    , stage = new Stage(canvas, {numLayers: 2, frameRate: 60});

The defaults are defined above. The stage consists of layers, with 0 being
the bottommost. The stage also provides #start and #stop methods, and
frameCount, height, and width properties.

### Elements

You can then add drawing elements (hereafter "elements") to
the stage:

  var el = stage.addElement(MyElement, {});

This will add an element of type MyElement to the stage. You have to define
your own element types; more on that later. #addElement takes an optional
init object to customize that particular element instance.

Element behavior is defined by the #update method. By default it only calls
sprite.update(), to animate the element's sprite. You can redefine it for
element types (as we'll see later), or for individual instances:

  el.update = function() {
    sprite.update();
    this.x = (this.x + 1) % stage.width;
  }

You can also redefine an element's #render method if you want to customize its
appearance; by default it relies on its sprite to handle display.

Note that an element must always have the x and y properties defined, which
are 0 by default.

### Sprites

An element's display is usually handled by its sprite object. You can create
one thusly:

  el.sprite = new Sprite();
  el.sprite.addSourcesByUrl('normal', ['img1.png', 'img2.png']);

Elements' sprites are usually created in the element type constructor, or
a custom sprite object can be passed to an element instance's init object:

  stage.addElement(MyElement, {});
  stage.addElement(MyElement, {});

  var s = new Sprite();
  s.addSourcesByUrl('normal', ['img1.png', 'img2.png']);
  var customEl = stage.addElement(MyElement, {sprite: s});

A sprite consists of one or more "modes"; the default mode is called "normal".
Each mode has one or more images, which are displayed in sequence as an
animation. For example, you may have a mode called "dying", which shows a
player being killed, and one called "dead", where they are just lying there.

  el.update = function() {
    if (this.health < 0) {
      this.sprite.setMode('dead');
    }
    this.sprite.update();
  }

You can also add sources as image buffers (such as a canvas element). Henri
includes a convenience Buffer object, which is a wrapper around a canvas:

  var b = new Buffer(100, 100);
  b.fillStyle = 'black';
  b.fillRect(10, 10, 80, 80);
  el.sprite.addSource('normal', b);

This will add the buffer to the 'normal' sprite mode.

You can get the current image at any time using #getImage.

### Element Types

To add an element to the stage, you must provide a constructor for that type:

  stage.addElement(MyElement);
  stage.addElement(MyElement);
  stage.addElement(MyElement, {customVal: 30});

  function MyElement(I) {
    I = I || {};

    this.customVal = I.customVal || 100;

    this.sprite = new Sprite();
    this.sprite.addSourcesByUrl('normal', ['myel1.png', 'myel2.png',
        'myel3.png']);

    this.update = function() {
      this.sprite.update();
      console.log('Custom value is: ' + this.customVal);
    }
  }

In this example, the first two elements added to the stage will print "Custom
value is: 100", but the third will print "Custom value is 30". Note that it
isn't required to define #update here; the default #update will just call
sprite.update().

F.A.Q.
------

### Why is Henri better?
It probably isn't. I wanted to get a better feel for the HTML5 canvas and
drawing API. Plus it's fun.

### Why is it called Henri?
"Matisse" was taken already.

