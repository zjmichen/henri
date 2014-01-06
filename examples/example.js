window.onload = function() {
  var shipStage = new Stage(document.getElementById('ship')),
      clockStage = new Stage(document.getElementById('clock'));

  shipStage.toroidial = true;
  shipStage.debug = true;
  shipStage.addElement(0, Ship, {x: 100, y: 100});

  clockStage.debug = true;
  clockStage.addElement(0, Clock, {width: 200, height: 200, x: 200, y:200});

  shipStage.start();
  clockStage.start();
}
