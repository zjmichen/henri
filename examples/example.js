window.onload = function() {
  var clockStage = new Stage(document.getElementById('clock')),
      clock;

  clock = clockStage.addElement(0, Clock, {width: 100, height: 200, x: 250, y:250});

  clockStage.at(100, function() {
    clock.moveTo(105, 105, 50);
  });

  clockStage.start();

  window.clockStage = clockStage;

  var ide = new Ide(clockStage, '#controls');
};
