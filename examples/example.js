window.onload = function() {
  var s = new Stage(document.getElementById('example')),
      i, n;

  for (i = 0; i < 12; i++) {
    n = s.addElement(0, Numeral, {});
    n.value = i+1;

    n.x = 0.5*(s.width - n.width) * Math.sin( (i+1) / 12 * 2*Math.PI) + 0.5*s.width;
    n.y = -0.5*(s.height - n.height) * Math.cos( (i+1) / 12 * 2*Math.PI) + 0.5*s.height;
  }

  var hrHand = s.addElement(1, Hand, {
    width: 350,
    height: 10,
    x: 0.5*s.width,
    y: 0.5*s.height,

    update: function() {
      var d = new Date(),
          hours = d.getHours() + (d.getMinutes() / 60);

      this.angle = (hours / 12) * Math.PI * 2 - 0.5*Math.PI;
    }
  });

  var minHand = s.addElement(1, Hand, {
    width: 450,
    height: 10,
    x: 0.5*s.width,
    y: 0.5*s.height,
    update: function() {
      var d = new Date(),
          mins = d.getMinutes() + (d.getSeconds() / 60);

      this.angle = (mins / 60) * Math.PI * 2 - 0.5*Math.PI;
    }
  });

  var secHand = s.addElement(1, Hand, {
    width: 450,
    height: 2,
    x: 0.5*s.width,
    y: 0.5*s.height,
    update: function() {
      var d = new Date(),
          secs = d.getSeconds() + (d.getMilliseconds() / 1000);

      this.angle = (secs / 60) * Math.PI * 2 - 0.5*Math.PI;
    }
  });

  s.at(250, function() {
    secHand.moveTo(200, 200, 200);
  });

  s.start();
}

var Numeral = function() {
  var b = new Buffer(50, 50);
  this.value = 0;
  this.y = 100;
  this.width = 50;
  this.height = 50;

  this.render = function() {
    b.clearRect(0, 0, this.width, this.height);
    b.fillText(this.value, 0.5*this.width, 0.5*this.height);
    b.font = '16px sans-serif';

    return b.canvas;
  };
};

var Hand = function() {
  this.angle = -0.5*Math.PI;

  this.render = function() {
    var b = new Buffer(this.width, this.height);

    b.fillRect(0.5*this.width, 0, 0.5*this.width, this.height);

    return b.canvas;
  };
}

var BoxDrawer = function() {
  this.width = 0;
  this.height = 0;
  this.drawing = false;

  this.handlers = {
    onmousedown: function() {

    }
  }
}