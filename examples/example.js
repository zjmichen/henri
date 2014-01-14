window.onload = function() {
  var clockStage = new Stage(document.getElementById('clock'), true),
      clock;

  clock = clockStage.addElement(0, Clock, {width: 100, height: 200, x: 250, y:250});

  clockStage.initSocket(io, 'http://localhost:3000', true);

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
