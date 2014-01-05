Henri
=====

A fun 2d HTML5 canvas library.

Usage
-----

Include all the files in src/ in your html. I cat them together with
`cat src/*.js > examples/henri.js` and then include that.

Initialize the stage:

```javascript
window.onload = function() {
  var s = new Stage(document.getElementById('myCanvas'));

```

Boom, initialized. You probably want stuff in there, so you can do  this:

```javascript
  var a = s.addElement(Asteroid, {x: 100, y: 100});
```

where `Asteroid` is an object constructor that you define. All stage elements
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