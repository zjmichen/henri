window.onload = function() {
  var clockStage = new Henri.Stage(document.getElementById('clock'), true),
      clock;

  Henri.defaults.drawPosition = 'center';

  clock = clockStage.addElement(0, Clock, {width: 100, height: 200, x: 250, y:250});

  clockStage.addKeyFrame(50, clock, {x: 100, y: 100});
  clockStage.addKeyFrame(100, clock, {x: 300, y: 100});
  clockStage.addKeyFrame(200, clock, {x: 300, y: 100});
  clockStage.addKeyFrame(300, clock, {
    x: 250,
    y: 250,
    realWidth: 500,
    realHeight: 500
  });


  clockStage.at(300, function() {
    clockStage.stop();
  });

  window.clockStage = clockStage;
  window.clock = clock;

  var ide = new Ide(clockStage, '#controls');
};
