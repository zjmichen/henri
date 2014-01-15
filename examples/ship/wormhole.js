var Wormhole = function() {
  var sprite = new Sprite();

  sprite.addImage('normal', 'img/wormhole.png');

  this.update = function() {
    var i;

    this.angle += 0.01;
    sprite.update();

    for (i = 0; i < this.neighbors.length; i++) {
      if (this.distanceTo(this.neighbors[i]) < 50) {
        this.stage.socket.emit('wormhole', this.neighbors[i].serialize());
      }
    }
  };

  this.render = function() {
    return sprite.render();
  };

  this.init = function() {
    this.stage.socket.on('wormhole', function(data) {
      console.log('Wormhole: ' + data);
    });
  };
};