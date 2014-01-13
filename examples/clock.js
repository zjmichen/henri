var Clock = (function() {

  var _Clock = function(I) {
    var that = this,
        buffer, stage, aspectRatio,
        i, n;

    this.width = 500;
    this.height = 500;
    this.realWidth = (I.width === undefined) ? width : I.width;
    this.realHeight = (I.height === undefined) ? height : I.height;
    aspectRatio = this.height / this.width;
    buffer = new Buffer(this.width, this.height);
    stage = new Stage(buffer.canvas);

    for (i = 0; i < 12; i++) {
      n = stage.addElement(0, Numeral, {value: i+1});

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

  var Numeral = function(I) {
    var b = new Buffer(50, 50);
    this.value = I.value || 0;
    this.y = 100;
    this.width = 50;
    this.height = 50;

    b.fillText(this.value, 0.5*this.width, 0.5*this.height);

    this.render = function() {
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
