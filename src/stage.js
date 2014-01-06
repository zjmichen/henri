var Stage = (function() {

  var StageConstr = function(canvas) {
    var update, draw, loop, 
        layers = [],
        ats = [],
        mainCtx = canvas.getContext('2d'),
        backBuf,
        debugGrid = true;

    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;
    this.frame = 0;
    this.toroidial = false;
    layers.push(new Layer(this.width, this.height));

    backBuf = new Buffer(this.width, this.height);

    this.addElement = function(layer, ElementType, I) {
      var el;

      if (layer >= layers.length) {
        layers.push(new Layer(this.width, this.height));
        layer = layers.length - 1;
      }

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.stage = this;
      el.removeFromStage = function() {
        layers[layer].elements.splice(layers[layer].elements.indexOf(el), 1);
      };

      layers[layer].elements.push(el);

      return el;
    };

    this.start = function() {
      var that = this,
          delay = 1000 / this.frameRate;

      loop = setInterval(function() {
        that.update();
        that.draw();
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

    this.update = function() {
      if (ats[this.frame] !== undefined) {
        ats[this.frame].forEach(function(callback) {
          callback();
        });
        delete ats[this.frame];
      }

      layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          el.update();
        });
      });

      this.frame++;
    }.bind(this);

    this.draw = function() {
      var i;
      mainCtx.clearRect(0, 0, this.width, this.height);
      backBuf.clearRect(0, 0, this.width, this.height);

      if (debugGrid) {
        for (i = 0; i < this.width; i+=10) {
          backBuf.save();
          backBuf.beginPath();
          backBuf.lineWidth = 1;
          backBuf.strokeStyle = 'rgba(127,127,127,0.5)';

          if (i % 50 === 0) {
            backBuf.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          }
          if (i % 100 === 0) {
            backBuf.strokeStyle = 'rgba(0, 0, 0, 1)';
          }

          backBuf.moveTo(i, 0);
          backBuf.lineTo(i, this.height);

          backBuf.stroke();
          backBuf.restore();
        }

        for (i = 0; i < this.height; i += 10) {
          backBuf.save();
          backBuf.beginPath();
          backBuf.lineWidth = 2;
          backBuf.lineWidth = 1;
          backBuf.strokeStyle = 'rgba(127, 127, 127, 0.5)';

          if (i % 50 === 0) {
            backBuf.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          }
          if (i % 100 === 0) {
            backBuf.strokeStyle = 'rgba(0, 0, 0, 1)';
          }

          backBuf.moveTo(0, i);
          backBuf.lineTo(this.width, i);

          backBuf.stroke();
          backBuf.restore();
        }
      }

      layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          var x = el.x,
              y = el.y,
              img;

          if (this.toroidial) {
            x = x % this.width;
            y = y % this.height;
          }

          backBuf.save();
          backBuf.translate(x, y);
          backBuf.rotate(el.angle);
          backBuf.scale(el.scale, el.scale);

          img = el.render();

          if (el.drawPosition === 'center') {
            backBuf.translate(-0.5*img.width, -0.5*img.height);
          }
          backBuf.drawImage(img, 0, 0);

          backBuf.restore();
        }.bind(this));
      }.bind(this));

      mainCtx.drawImage(backBuf.canvas, 0, 0);
    }.bind(this);

  };

  return StageConstr;
})();