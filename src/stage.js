var Stage = (function() {

  var StageConstr = function(canvas) {
    var update, draw, loop, 
        elements = [],
        ats = [],
        mainCtx = canvas.getContext('2d'),
        backBuf;

    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;
    this.frame = 0;
    this.toroidial = false;

    backBuf = new Buffer(this.width, this.height);

    this.addElement = function(ElementType, I) {
      var el;

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.stage = this;
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

    this.at = function(frameWhen, callback) {
      if (ats[frameWhen] === undefined) {
        ats[frameWhen] = [];
      }

      ats[frameWhen].push(callback);
    };

    update = function() {
      if (ats[this.frame] !== undefined) {
        ats[this.frame].forEach(function(callback) {
          callback();
        });
        delete ats[this.frame];
      }

      elements.forEach(function(el) {
        el.update();
      });

      this.frame++;
    }.bind(this);

    draw = function() {
      mainCtx.clearRect(0, 0, this.width, this.height);
      backBuf.clearRect(0, 0, this.width, this.height);

      for (var i = 0; i < 10; i++) {
        backBuf.strokeStyle = 'black';
        backBuf.beginPath();
        backBuf.moveTo(i * 0.1*canvas.width, 0);
        backBuf.lineTo(i * 0.1*canvas.width, canvas.height);
        backBuf.moveTo(0, i * 0.1*canvas.height);
        backBuf.lineTo(canvas.width, i * 0.1*canvas.height);
        backBuf.stroke();
      }

      elements.forEach(function(el) {
        var x = el.x,
            y = el.y;

        if (this.toroidial) {
          x = x % this.width;
          y = y % this.height;
        }

        backBuf.save();
        backBuf.translate(x, y);
        backBuf.rotate(el.angle);
        backBuf.scale(el.scale, el.scale);
        backBuf.translate(-0.5*el.width, -0.5*el.height);

        backBuf.drawImage(el.render(), 0, 0);

        backBuf.restore();
      }.bind(this));

      mainCtx.drawImage(backBuf.canvas, 0, 0);
    }.bind(this);

  };

  return StageConstr;
})();