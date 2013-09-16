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
      sideSpeed: 35,
      cameraHeight: 5,
      cubeXSpread: 10000,
      frameRate: 50
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
      self.moveCubes();
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
      
      if(self.left){
        _.each(self.cubes, function (cube) {
          cube.move(-1 * self.settings.sideSpeed, self.settings.forwardSpeed);
        });
      }
      else if(self.right){
        _.each(self.cubes, function (cube) {
          cube.move(self.settings.sideSpeed, self.settings.forwardSpeed);
        });
      }
      else {
        _.each(self.cubes, function (cube) {
          cube.move(0, self.settings.forwardSpeed);
        });
      }

      for(var i = 0; i < self.cubes.length; i++){
        if(self.cubes[i].frontSquare[0].y > 12000){
          self.cubes[i] = null;
        }
      }
      self.cubes = _.compact(self.cubes);

    },

    drawCubes: function () {
      var self = this;
      self.context.clearRect(0,0, self.width , self.height);
      _.each(self.cubes, function (cube){
        cube.draw();
      })
    },

    // Re-render the titles of the todo item.
    setUpDimensions: function(width, height) {

    }

  });