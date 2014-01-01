/**
 * This is modified from Mark Crossley's animated HTML5 canvas odometer,
 * http://www.wilmslowastro.com/odometer/odometer.html, which is under the
 * GPLv3
 */
function Buffer(width, height) {
  return (function(width, height) {
    var buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer.getContext('2d');
  })(width, height);
}
