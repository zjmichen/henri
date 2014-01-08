var Debug = function(I) {
  this.draw = {
    grid: false,
    outlines: false,
    focus: false,
    framecount: false,
    events: false,
  };

  this.canvas = I.canvas;
  this.loop = I.loop;
  this.layers = I.layers;
  this.ats = I.ats;
  this.events = I.events;
  this.hasFocus = I.hasFocus;

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

  this.drawFramecount = function(ctx, frame) {
    ctx.font = '18px sans-serif';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.textBaseline = 'top';
    ctx.fillText(frame, 0, 0);
  };

};