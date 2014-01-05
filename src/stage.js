var Stage = (function() {

  var StageConstr = function(canvas) {
    var update, draw, loop, 
        elements = [],
        ctx = canvas.getContext('2d');

    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;

    this.addElement = function(ElementType, I) {
      var el;

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.removeFromStage = function() {
        elements.splice(elements.indexOf(el), 1);
      };

      elements.push(el);

      return el;
    };

    this.start = function() {
      var delay = 1000 / this.frameRate;
      loop = setInterval(function() {
        update();
        draw();
      }, delay);
    };

    this.stop = function() {
      clearInterval(loop);
    };

    update = function() {
      elements.forEach(function(el) {
        el.update();
      });
    };

    draw = function() {
      for (var i = 0; i < 10; i++) {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(i * 0.1*canvas.width, 0);
        ctx.lineTo(i * 0.1*canvas.width, canvas.height);
        ctx.moveTo(0, i * 0.1*canvas.height);
        ctx.lineTo(canvas.width, i * 0.1*canvas.height);
        ctx.stroke();
      }

      elements.forEach(function(el) {
        var x = el.x - 0.5*el.width,
            y = el.y - 0.5*el.height;

        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.angle);
        ctx.scale(el.scale, el.scale);
        ctx.translate(-0.5*el.width, -0.5*el.height);

        ctx.drawImage(el.render(), 0, 0);

        ctx.restore();
      });
    };

  };

  return StageConstr;
})();