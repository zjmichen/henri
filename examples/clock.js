var Clock = (function() {

  var _Clock = function(I) {
    var buffer = new Buffer(500, 500),
        width = (I.width === undefined) ? 500 : I.width,
        height = (I.height === undefined) ? 500 : I.height,
        stage = new Stage(buffer.canvas),
        aspectRatio = height / width,
        that = this,
        i, n;

    this.scale = width / 500;
    if (width !== height) {
      buffer.canvas.height *= aspectRatio;
    }

    for (i = 0; i < 12; i++) {
      n = stage.addElement(0, Numeral, {});
      n.value = i+1;

      n.x = 0.5*(stage.width - n.width) * 
          Math.sin( (i+1) / 12 * 2*Math.PI) + 0.5*stage.width;
      n.y = -0.5*(stage.height - n.height) * 
          Math.cos( (i+1) / 12 * 2*Math.PI) + 0.5*stage.height;
    }

    var hrHand = stage.addElement(1, Hand, {
      width: 350,
      height: 10,
      x: 0.5*stage.width,
      y: 0.5*stage.height,

      update: function() {
        var d = new Date(),
            hours = d.getHours() + (d.getMinutes() / 60);

        this.angle = (hours / 12) * Math.PI * 2 - 0.5*Math.PI;
      }
    });

    var minHand = stage.addElement(1, Hand, {
      width: 450,
      height: 10,
      x: 0.5*stage.width,
      y: 0.5*stage.height,
      update: function() {
        var d = new Date(),
            mins = d.getMinutes() + (d.getSeconds() / 60);

        this.angle = (mins / 60) * Math.PI * 2 - 0.5*Math.PI;
      }
    });

    var secHand = stage.addElement(1, Hand, {
      width: 450,
      height: 2,
      x: 0.5*stage.width,
      y: 0.5*stage.height,
      update: function() {
        var d = new Date(),
            secs = d.getSeconds() + (d.getMilliseconds() / 1000);

        this.angle = (secs / 60) * Math.PI * 2 - 0.5*Math.PI;
      }
    });

    this.update = stage.update;
    this.render = function() {
      buffer.save();
      buffer.scale(1, aspectRatio);
      stage.draw();
      buffer.restore();

      return buffer.canvas;
    };

    this.events = {
      click: function(evt) {
        this.moveTo(evt.canvasX, evt.canvasY, 10);
      }.bind(that)
    };
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

  return _Clock;

})();
