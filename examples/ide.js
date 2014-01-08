var Ide = (function($) {

  var _Ide = function(stage, controls) {
    var canvas = $(stage.canvas),
        controls = $(controls).find('.ide-control');

    controls.each(function(i, control) {
      control = $(control);
      if (control.attr('data-draw')) {
        control.attr('data-draw').split(/\s+/).forEach(function(type) {
          control.click(function(evt) {
            stage.debug.draw[type] = !stage.debug.draw[type];
          });
        });
      }
    });
  }

  return _Ide;
})(jQuery);