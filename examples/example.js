window.onload = function() {
  var s = new Stage(document.getElementById('example'));

  var e = s.addElement(Ship, {x: 30});
  var f = s.addElement(Ship, {x: 30});

  e.x = 200;
  e.y = 200;

  f.angle = Math.PI * 0.25;
  f.x = 100;
  f.y = 300;
  f.scale = 0.5;

  s.start();
}

var Ship = function() {
  this.type = 'ship';
};