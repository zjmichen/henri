var Stage = (function() {

  var StageConstr = function(canvas) {
    var update, draw, loop, 
        layers = [],
        ats = [],
        mainCtx = canvas.getContext('2d'),
        backBuf,
        debugGrid = true;

    this.debug = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.frameRate = 60;
    this.frame = 0;
    this.toroidial = false;
    layers.push(new Layer(this.width, this.height));

    backBuf = new Buffer(this.width, this.height);

    this.addElement = function(layer, ElementType, I) {
      var el, evtName;

      if (layer >= layers.length) {
        layers.push(new Layer(this.width, this.height));
        layer = layers.length - 1;
      }

      ElementType.prototype = new Element(I);
      el = new ElementType(I);

      el.stage = this;
      el.removeFromStage = function() {
        layers[layer].elements.splice(Layers[layer].elements.indexOf(el), 1);
      };

      for (evtName in el.events) {
        document.addEventListener(evtName, el.events[evtName]);
      }

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

      if (this.debug) {
        drawGrid(backBuf);
      }

      layers.forEach(function(layer) {
        layer.elements.forEach(function(el) {
          var x = el.x,
              y = el.y,
              img;

          if (this.toroidial) {
            x = ((x % this.width) + this.width) % this.width;
            y = ((y % this.height) + this.height) % this.height;
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

          if (this.debug) {
            backBuf.lineWidth = 2;
            backBuf.strokeStyle = 'rgba(255, 100, 0, 0.8)';
            backBuf.strokeRect(0, 0, img.width, img.height);
          }

          backBuf.restore();
        }.bind(this));
      }.bind(this));

      mainCtx.drawImage(backBuf.canvas, 0, 0);
    }.bind(this);

    drawGrid = function(ctx) {
      var width = ctx.canvas.width,
          height = ctx.canvas.height,
          tenColor = 'rgba(127, 127, 255, 0.5)',
          fiftyColor = 'rgba(0, 0, 255, 0.5)',
          hundredColor = 'rgba(0, 0, 255, 0.8)';

      for (i = 0; i < width; i+=10) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = tenColor;

        if (i % 50 === 0) {
          ctx.strokeStyle = fiftyColor;
        }
        if (i % 100 === 0) {
          ctx.strokeStyle = hundredColor;
        }

        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);

        ctx.stroke();
        ctx.restore();
      }

      for (i = 0; i < height; i += 10) {
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = tenColor;

        if (i % 50 === 0) {
          ctx.strokeStyle = fiftyColor;
        }
        if (i % 100 === 0) {
          ctx.strokeStyle = hundredColor;
        }

        ctx.moveTo(0, i);
        ctx.lineTo(width, i);

        ctx.stroke();
        ctx.restore();
      }
    }

  };

  return StageConstr;
})();