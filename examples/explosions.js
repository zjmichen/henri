window.onload = function() {
  var canvas = document.getElementById('counter')
    , stage = new Stage(canvas);


  var thing1 = new Thing();
  thing1.add({asdf:'asdf'});

  var thing2 = new Thing();
  thing2.add({asdf:'fdsa'});

  thing1.setItemValue(2);

  console.log(thing1);
  console.log(thing2);

/*
  stage.addElement(Explosion, {x: 0, y: 0});
  stage.addElement(Explosion, {x: 50, y: 0});

  window.e = stage.addElement(Explosion, {x: 100, y: 0});

  window.e.update = function() {
    this.sprite.update();
    this.y += 0.5*Math.sin(0.01*stage.frameCount);
    this.x += 0.5*Math.cos(0.01*stage.frameCount);
  };

  stage.start();

};

function Explosion(I) {
  this.sprite = new Sprite();
  this.sprite.addSourcesByUrl('normal', ['explosion1.png', 'explosion2.png']);
}

*/
};

function Thing() {
  this.a = 'potato';
  this.objs = [];
  this.i = new Item();

  this.add = function(obj) {
    this.objs.push(obj);
  };

  this.setItemValue = function(val) {
    this.i.setVal(val);
  };
}

function Item() {
  this.value = 1;

  this.setVal = function(val) {
    this.value = val;
  };
}