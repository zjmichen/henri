window.onload = function() {
  var clockStage = new Stage(document.getElementById('clock'), true),
      clock;

  clock = clockStage.addElement(0, Clock, {width: 100, height: 200, x: 250, y:250});

  clockStage.at(100, function() {
    clock.moveTo(105, 105, 50);
  });

  clockStage.at(200, function() {
    clock.addLinearTransform({
      x: 250,
      y: 250,
      realWidth: 500,
      realHeight: 500
    }, 100);
  });

  clockStage.start();

  window.clockStage = clockStage;
  window.clock = clock;

  var ide = new Ide(clockStage, '#controls');
};
