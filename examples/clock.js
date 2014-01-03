window.onload = function() {
  var canvas = document.getElementById('clock')
    , stage = new Stage(canvas);

    console.log(canvas);

  stage.addElement(Explosion, {name: 'tom'});
  var e = stage.addElement(Explosion, {name: 'tom', x: 100});

  stage.addElement(Ship, {x: 100, y: 100});

  stage.start();
};

var Explosion = {
  type: 'Explosion',
  x: 30,
  y: 30,
  name: 'unnamed',
  init: function(I) {
    var s = new Sprite();
    s.addImagesByUrl('normal', ['explosion1.png', 'explosion2.png']);
    this.sprite = s;
  }
};

var Ship = {
  type: 'Ship',

  init: function(I) {
    var s = new Sprite();
    s.addImagesByUrl('normal', ['ship_normal.png']);
    s.addImagesByUrl('moving', ['ship_fire1.png',
                                'ship_fire2.png',
                                'ship_fire3.png']);
    this.sprite = s;
  },

  update: function() {
    this.sprite.update();
  },

  handlers: {
    keydown: function(evt) {
      console.log(evt);
    }
  }
}