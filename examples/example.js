window.onload = function() {
  var shipStage = new Stage(document.getElementById('ship')),
      clockStage = new Stage(document.getElementById('clock')),
      clock;

  shipStage.toroidial = true;
  shipStage.debug = true;
  shipStage.addElement(0, Ship, {x: 100, y: 100});

  clockStage.debug = true;
  clock = clockStage.addElement(0, Clock, {width: 100, height: 200, x: 250, y:250});

  clockStage.at(100, function() {
    clock.moveTo(105, 105, 50);
  });

  shipStage.start();
  clockStage.start();
};
