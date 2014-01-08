var Ide = (function($) {

  var _Ide = function(stage, controlsSel) {
    var canvas = $(stage.canvas),
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

    stage.debug.draw.events = true;
  }

  return _Ide;
})(jQuery);