window.onload = function() {
  var stage = new Stage(document.getElementById('ship'), true),
      ship;

  stage.debug.draw.grid = true;
  stage.debug.draw.focus = true;
  stage.debug.draw.frames = true;
  stage.toroidial = true;
  stage.initSocket(io, 'http://localhost:3000', true);

  background = stage.addElement(Space);
  wormhole = stage.addElement(Wormhole, {x: 100, y: 100}, 1);
  ship = stage.addElement(Ship, {width: 100, height: 200, x: 250, y:250}, 1);

  window.stage = stage;
  window.ship = ship;

  stage.start();

};
