var Debug = function(stage, priv) {
  var eventDrawQ = [];

  this.draw = {
    grid: false,
    outlines: false,
    focus: false,
    framecount: false,
    events: false,
  };

  this.stage = stage;

  this.addEvent = function(x, y) {
    eventDrawQ.push({x: x, y: y, ttl: 50});
  };

  this.drawBelow = function(ctx) {
    if (this.draw.grid) {
      this.drawGrid(ctx);
    }
  };

  this.drawAbove = function(ctx) {
    if (this.draw.framecount) {
      this.drawFramecount(ctx, this.stage.frame);
    }
    if (this.draw.events) {
      this.drawEvents(ctx);
    }
    if (this.draw.focus) {
      this.drawFocus(ctx);
    }
  }

  this.drawGrid = function(ctx) {
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
  };

  this.drawFocus = function(ctx) {
    if (priv.hasFocus) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    }
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, this.stage.width, this.stage.height);
  };

  this.drawFramecount = function(ctx, frame) {
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textBaseline = 'top';
    ctx.fillText(frame, 0, 0);
  };

  this.drawEvents = function(ctx) {
    eventDrawQ.forEach(function(p) {
      var opacity = p.ttl / 50;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 135, 135, ' + opacity + ')';
      ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
      ctx.fill();

      p.ttl--;
      if (p.ttl <= 0) {
        eventDrawQ.splice(p, 1);
      }
    });
  };

  this.drawOutline = function(ctx, el, img) {
    ctx.lineWidth = 2 / el.scale;
    ctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
    ctx.strokeRect(0, 0, img.width, img.height);
  };

};
