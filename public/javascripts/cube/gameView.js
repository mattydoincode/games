var GameView = Backbone.View.extend({

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "keyup": "registerUp",
      "keydown": "registerDown"
    },

    settings: {
      newCubesPerFrame: 2,
      forwardSpeed: 200,
      sideSpeed: 45,
      cameraHeight: 5,
      cubeXSpread: 10000,
      frameRate: 50,
      anglePerFrame: Math.PI/200,
      maxAngle: Math.PI/20
    },


          /*
  left arrow   37
  up arrow   38
  right arrow  39
  down arrow   40
      */

    registerDown: function (e) {
      var self = this;
      if(e.which==37){
        self.left = true;
      }
      else if(e.which==39){
        self.right = true;
      }
    },
    registerUp: function (e) {
      var self = this;
      if(e.which==37){
        self.left = false;
      }
      else if(e.which==39){
        self.right = false;
      }
    },
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'setUpDimensions', 'render');
      self.context = self.options.context;
      self.height = self.options.height;
      self.width = self.options.width;
      self.setUpNewGame();
    },

    render: function () {
      var self = this;

      self.addNewCubes();
      self.context.clearRect(-self.width,-self.height, self.width*3, self.height*3);
      self.rotateCanvas();
      self.moveCubes();
      self.drawHorizon();
      self.drawCubes();

      setTimeout(function () {
        self.render();
      }, self.settings.frameRate);
    },

    setUpNewGame: function () {
      var self = this;
      self.cubes = [];
      self.render();
      self.right = false;
      self.left = false;
      self.currentAngle = 0;
      self.currentTurn = 0;
    },

    addNewCubes: function () {
      var self = this;
      for(var i = 0; i < self.settings.newCubesPerFrame; i++){
        var x = (Math.random()*self.settings.cubeXSpread * 2)-self.settings.cubeXSpread;
        var cube = new CubeView({center: {x: x, y: 0, z: 0}, context: self.context});
        self.cubes.push(cube);
      }
    },

    moveCubes: function () {
      var self = this;
      
      _.each(self.cubes, function (cube) {
        cube.move(self.currentTurn, self.settings.forwardSpeed);
      });

      for(var i = 0; i < self.cubes.length; i++){
        if(self.cubes[i].frontSquare[0].y > 12000){
          self.cubes[i] = null;
        }
      }
      self.cubes = _.compact(self.cubes);

    },

    drawHorizon: function () {
      var self = this;
      self.context.fillStyle="#ddd";
      self.context.fillRect(-1 * self.width/2,-1 * self.height/2, self.width*2, self.height);
      self.context.fillStyle="#666";
      self.context.fillRect(-1 * self.width/2,self.height/2, self.width * 2, self.height);
    },

    drawCubes: function () {
      var self = this;
      
      _.each(self.cubes, function (cube){
        cube.draw();
      })
    },

    rotateCanvas: function () {
      var self = this;
      self.currentTurn = (self.currentAngle / self.settings.maxAngle) * self.settings.sideSpeed;
      if(self.left){
        if(self.currentAngle<=self.settings.maxAngle * -1){
          return;
        }
        if(self.currentAngle > 0){
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(2 * self.settings.anglePerFrame);
          self.currentAngle+=2 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
        else {
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(1 * self.settings.anglePerFrame);
          self.currentAngle+=1 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
      }
      else if(self.right){
        if(self.currentAngle>=self.settings.maxAngle){
          return;
        }
        if(self.currentAngle < 0){
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(-2 * self.settings.anglePerFrame);
          self.currentAngle+=-2 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
        else {
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(-1 * self.settings.anglePerFrame);
          self.currentAngle+=-1 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
      }
      else {
        if(self.currentAngle > 0 && self.currentAngle < self.settings.maxAngle){
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(1 * self.settings.anglePerFrame);
          self.currentAngle+=1 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
        else if (self.currentAngle < 0 && self.currentTurn > -1 * self.settings.maxAngle) {
          self.context.translate(self.width/2, self.height/2);
          self.context.rotate(-1 * self.settings.anglePerFrame);
          self.currentAngle+=-1 * self.settings.anglePerFrame;
          self.context.translate(-1 * self.width/2, -1 * self.height/2);
        }
        else {
          if(self.currentAngle!=0){
            self.context.translate(self.width/2, self.height/2);
            self.context.rotate(self.currentAngle * -1);
            self.currentAngle=0;
            self.context.translate(-1 * self.width/2, -1 * self.height/2);
          }
        }
      }
    },

    // Re-render the titles of the todo item.
    setUpDimensions: function(width, height) {

    }

  });