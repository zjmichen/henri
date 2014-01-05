var Buffer = function(width, height) {
  return (function(width, height) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer.getContext('2d');
  })(width, height);
};