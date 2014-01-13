var Ide = (function($) {

  var _Ide = function(stage, controlsSel) {
    var canvas = $(stage.canvas),
        timelineCanvas = $('#timeline')[0],
        timelineStage,
        controls = {
          draw: $(controlsSel).find('.ide-control.draw'),
          start: $(controlsSel).find('.ide-control.start'),
          stop: $(controlsSel).find('.ide-control.stop')
        };

    controls.draw.each(function(i, control) {
      var type = $(control).attr('name');
      stage.debug.draw[type] = $(control)[0].checked;
      $(control).click(function(evt) {
        stage.debug.draw[type] = !stage.debug.draw[type];
      });
    });

    controls.start.click(function() {
      stage.start();
    });

    controls.stop.click(function() {
      stage.stop();
    });

    timelineStage = new Stage(timelineCanvas, {});
    timelineStage.addElement(0, Timeline, {
      width: timeline.width, 
      height: timeline.height,
      x: 0.5*timeline.width,
      y: 0.5*timeline.height
    });

    timelineStage.start();
  }

  return _Ide;
})(jQuery);

var Timeline = function(I) {
  var b = new Buffer(I.width, I.height),
      that = this;

  this.cursor = 0;

  this.render = function() {
    var i;

    b.clearRect(0, 0, this.width, this.height);

    b.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    b.lineWidth = 1;
    b.beginPath();
    for (i = 0; i < this.width; i+= 10) {
      b.moveTo(i, 0);
      b.lineTo(i, this.height);
    }
    b.stroke();

    b.fillStyle = 'rgba(0, 0, 255, 0.5)';
    b.fillRect(this.cursor*10, 0, 10, this.height);

    return b.canvas;
  };

  this.events = {
    click: function(evt) {
      this.cursor = Math.floor(evt.canvasX / 10);
    }.bind(that)
  };
};