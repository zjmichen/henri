var Ide = (function($) {

  var _Ide = function(stage, controlsSel) {
    var that = this,
        canvas = $(stage.canvas),
        timelineCanvas = $('#timeline')[0],
        timelineStage,
        controls = {
          draw: $(controlsSel).find('.ide-control.draw'),
          start: $(controlsSel).find('.ide-control.start'),
          stop: $(controlsSel).find('.ide-control.stop'),
          step: $(controlsSel).find('.ide-control.step'),
          reset: $(controlsSel).find('.ide-control.reset')
        },
        addAt = $('#addAt'),
        addAtBtn = $('#addAtBtn');

    addAtBtn.click(function() {
      eval('stage.at(' + stage.frame + ', function() {\n' + addAt.val() + '\n});');
      that.showAts(stage.frame);
    });

    controls.draw.each(function(i, control) {
      var type = $(control).attr('name');
      stage.debug.draw[type] = $(control)[0].checked;
      $(control).click(function(evt) {
        stage.debug.draw[type] = !stage.debug.draw[type];
        stage.draw();
      });
    });

    controls.start.click(function() {
      stage.start();
    });

    controls.stop.click(function() {
      stage.stop();
    });

    controls.step.click(function() {
      stage.update();
      stage.draw();
    });

    controls.reset.click(function() {
      stage.stop();
      stage.reset();
      stage.draw();
    });

    timelineStage = new Stage(timelineCanvas, {});
    timelineStage.addElement(0, Timeline, {
      width: timelineCanvas.width, 
      height: timelineCanvas.height,
      x: 0,
      y: 0,
      target: stage,
      numFrames: stage.debug.priv.ats.length + 1,
      drawPosition: 'corner',
      ats: stage.debug.priv.ats,
      keyFrames: stage.debug.priv.keyFrames,
      ide: this
    });

    this.showAts = function(frame) {
      var ats = stage.debug.priv.ats;

      if (ats[frame] !== undefined && ats[frame].length > 0) {
        $('#ats ul').empty();
        ats[frame].forEach(function(at, atNum) {
          var removeBtn = $('<a href="#">&times;</a>'),
              li = $('<li><pre>' + at + '</pre></li>');
          li.append(removeBtn);
          $('#ats ul').append(li);
          removeBtn.click(function() {
            stage.removeAt(frame, atNum);
            li.fadeOut();
          });
          console.log(at);
        });
      } else {
        $('#ats ul').empty();
      }
    };

    stage.draw();
    timelineStage.start();
  }

  return _Ide;
})(jQuery);

var Timeline = function(I) {
  var b = new Buffer(10*I.numFrames, I.height),
      that = this,
      stage = I.target,
      scroll = 0,
      framesVisible = I.width / 10,
      ats = I.ats,
      keyFrames = I.keyFrames;

  this.cursor = 0;

  this.update = function() {
    this.cursor = stage.frame;

    if (this.cursor > (scroll + framesVisible - 10)
        && scroll < I.numFrames - framesVisible) {
      scroll = this.cursor - framesVisible + 10;
    }
    if (this.cursor < (scroll + 10)) {
      scroll = Math.max(this.cursor - 10, 0);
    }

    this.x = -10*scroll;
  };

  this.render = function() {
    var i;

    b.clearRect(0, 0, b.canvas.width, b.canvas.height);

    b.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    b.lineWidth = 1;
    b.beginPath();
    for (i = scroll; i < scroll + framesVisible; i++) {
      b.moveTo(10*i, 0);
      b.lineTo(10*i, this.height);
      if (i % 10 === 0) {
        b.fillStyle = 'black';
        b.fillText(i, 10*i, 10);
      }
      if (ats[i] !== undefined && ats[i].length > 0) {
        b.fillStyle = 'rgba(127, 127, 0, 0.5)';
        b.fillRect(10*i, 0, 10, this.height);
      }
      if (keyFrames[i] !== undefined && keyFrames[i].length > 0) {
        b.fillStyle = 'rgba(0, 127, 0, 0.5)';
        b.fillRect(10*i, 0, 10, this.height);
      }
    }
    b.stroke();

    b.fillStyle = 'rgba(0, 0, 255, 0.5)';
    b.fillRect(this.cursor*10, 0, 10, this.height);

    return b.canvas;
  };

  this.events = {
    click: function(evt) {
      var boxNum = Math.floor(evt.canvasX / 10) + scroll;
      this.cursor = boxNum;
      stage.stop();
      stage.goToFrame(boxNum);

      I.ide.showAts(boxNum);

    }.bind(that)
  };
};