var Ship = function() {
  var that = this,
      sprite = new Sprite(),
      direction = 0,
      speed = 1,
      accel = 0.2,
      actions = [],
      turnLeft,
      turnRight,
      thrust;

  sprite.addImage('normal',    'img/ship_normal.png');
  sprite.addImage('thrusting', 'img/ship_fire1.png');
  sprite.addImage('thrusting', 'img/ship_fire2.png');
  sprite.addImage('thrusting', 'img/ship_fire3.png');

  this.update = function() {
    this.x += speed*Math.cos(direction);
    this.y += speed*Math.sin(direction);

    speed *= 0.99;

    actions.forEach(function(action) {
      action();
    });

    sprite.update();
  };

  this.render = function() {
    return sprite.render();
  };

  this.events = {
    keydown: function(evt) {
      if (evt.keyCode === 38) {
        if (sprite.getMode() !== 'thrusting') {
          sprite.setMode('thrusting');
        }

        if (actions.indexOf(thrust) === -1) {
          actions.push(thrust);
        }
      }

      if (evt.keyCode === 37 && actions.indexOf(turnLeft) === -1) {
        actions.push(turnLeft);
      }

      if (evt.keyCode === 39 && actions.indexOf(turnRight) === -1) {
        actions.push(turnRight);
      }

      if (evt.keyCode === 32) {
        this.stage.socket.send('SPACE');
      }
    },

    keyup: function(evt) {
      if (evt.keyCode === 38) {
        sprite.setMode('normal');
        actions.splice(actions.indexOf(thrust), 1);
      }

      if (actions.indexOf(turnLeft) !== -1) {
        actions.splice(actions.indexOf(turnLeft), 1);
      }
      if (actions.indexOf(turnRight) !== -1) {
        actions.splice(actions.indexOf(turnRight), 1);
      }
    }
  };

  turnLeft = function() {
    this.angle -= 0.1;
  }.bind(this);

  turnRight = function() {
    this.angle += 0.1;
  }.bind(this);

  thrust = function() {
    var xSpeed = speed*Math.cos(direction),
        ySpeed = speed*Math.sin(direction),
        xDelta = accel*Math.cos(this.angle),
        yDelta = accel*Math.sin(this.angle);

    xSpeed += xDelta;
    ySpeed += yDelta;
    speed = Math.sqrt(
        Math.pow(xSpeed, 2) + 
        Math.pow(ySpeed, 2));

    direction = Math.acos(xSpeed / speed);
    if (Math.asin(ySpeed / speed) < 0) {
      direction *= -1;
    }
  }.bind(this);

};