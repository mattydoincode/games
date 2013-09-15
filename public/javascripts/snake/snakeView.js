var SnakeView = Backbone.View.extend({

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {

    },

    settings: {
      gridX: 50,
      gridY: 0,
      gridColor: "#ddd",
      firstSnakeColor: "#68A9FF",
      restSnakeColor: "#004FFF",
      spotColor: "red",
      rate: 80,
      maxInputs: 4,
      startDirection: 2, // right,
      valueOfEating: 4
    },



    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'render', 'renderGrid', 'renderSnake');
      self.context = self.options.context;
      self.width = self.options.width;
      self.height = self.options.height;
      self.settings.gridY = Math.round(self.settings.gridX * (self.height / self.width));
      self.boxHeight = self.height / self.settings.gridY;
      self.boxWidth = self.width / self.settings.gridX;
      
      $(window).keydown(function (e) {
        self.registerInput(e.which);
      });

      //REFERENCE
      /*
      var queue = [];
      queue.push(2);         // queue is now [2]
      queue.push(5);         // queue is now [2, 5]
      var i = queue.shift(); // queue is now [5]
      alert(i); 
      */
      self.waiting = true;
      self.render();
    },

    startGame: function () {
      var self = this;
      self.snakeQueue = [];
      self.snakeQueue.push({x: 10, y: 3});
      self.spotPlaced = false;
      self.placeRandomSpot();
      self.inputQueue = [];
      self.extras = 0;
      //key inputs
      self.inputs = [];
      // 0 = not pressed, 1 = pressed, 2 = held?
      self.up = 0;
      self.down = 0;
      self.left = 0;
      self.right = 0;

      self.direction = self.settings.startDirection;



    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.clearCanvas();

      if(self.waiting){
        self.writeText();
      }
      else {
        //optional
        //self.renderGrid();
        
        self.checkInputs();
        self.moveSnake();
        self.renderSnake();
      }

      setTimeout(function (){ self.render(); }, self.settings.rate);
    },

    writeText: function () {
      var self = this;
      self.context.font="30px Arial";
      self.context.fillStyle = "Black";
      self.context.fillText("press space to begin",self.height /5,self.height/2 - 15);
    },

    placeRandomSpot: function () {
        var self = this;
        var found = false;
        while(!found){
          var self = this;
          var x = Math.floor((Math.random()*self.settings.gridX));
          var y = Math.floor((Math.random()*self.settings.gridY));
          var found = !_.any(self.snakeQueue, function (spot){
            return spot.x==x && spot.y==y;
          });
          self.spot = {x: x, y: y};
        }
    },

    clearCanvas: function () {
      var self = this;
      self.context.clearRect(0,0, self.width , self.height);
    },

    registerInput: function (key) {
      var self = this;
      /*
  left arrow   37
  up arrow   38
  right arrow  39
  down arrow   40
      */

      if(key== 32){
        if(self.waiting){
          self.startGame();
          self.waiting = false;
        }
      }

      if (key==37){
        if(self.left==0){
          self.left=1;
        }
      }
      else if(key==38){
        if(self.up==0){
          self.up=1;
        }
      }
      else if(key==39){
        if(self.right==0){
          self.right=1;
        }
      }
      else if(key==40){
        if(self.down==0){
          self.down=1;
        }
      }

    },

    checkInputs: function () {
      var self = this;
      if(self.inputs.length > self.settings.maxInputs){
        return;
      }
      //0 = left
      if(self.left==1){
        self.left=0;
        self.inputs.push(0);
      }
      //1  = up
      if(self.up==1){
        self.up=0;
        self.inputs.push(1);
      }
      //2 = right
      if(self.right==1){
        self.right=0
        self.inputs.push(2);
      }
      //3 = down
      if(self.down==1){
        self.down=0;
        self.inputs.push(3);
      }
    },

    moveSnake: function () {
      var self = this;
      if(self.inputs.length > 0){
        //then we must move the snake in a different direction potentially
        var newDirection = self.inputs.shift();
        if(newDirection == 0 && self.direction==2){

        }
        else if(newDirection == 1 && self.direction==3){

        }
        else if(newDirection == 2 && self.direction==0){

        }
        else if(newDirection == 3 && self.direction==1){
          
        }
        else {
          self.direction = newDirection;
        }
      }
      var oldSpot = self.snakeQueue[self.snakeQueue.length-1];
      var newSpot = {
        x: oldSpot.x,
        y: oldSpot.y
      };
      if(self.direction==0){
        newSpot.x--;
      }
      else if (self.direction==1){
        newSpot.y--;
      }
      else if (self.direction ==2){
        newSpot.x++;
      }
      else if (self.direction == 3){
        newSpot.y++;
      }

      if(newSpot.x==self.spot.x && newSpot.y==self.spot.y){
        self.extras+= self.settings.valueOfEating;
        self.placeRandomSpot();
      }
      if(self.extras>0){
        self.extras--;
      }
      else {
        self.snakeQueue.shift();
      }

      
      var startOver = _.any(self.snakeQueue, function (guy) {
        return guy.x==newSpot.x && guy.y==newSpot.y;
      });

      if(newSpot.x >= self.settings.gridX || newSpot.x < 0 || newSpot.y >=self.settings.gridY || newSpot.y < 0){
        startOver = true;
      }
      self.snakeQueue.push(newSpot);
      if(startOver){
        self.waiting = true;
      }


    },

    renderGrid: function () {
      var self = this;
      self.context.strokeStyle = "#ddd";

    
      for(var i = 0; i < self.settings.gridX; i++) {
        for(var j = 0; j < self.settings.gridY; j++) {
          //x, y, w, h
          self.context.strokeRect(i * self.boxWidth, j * self.boxHeight, self.boxWidth, self.boxHeight);
        }
      }
    },

    renderSnake: function () {
      var self = this;
      var first = true;
      for(var i = self.snakeQueue.length-1; i >=0; i--) {
        var spot = self.snakeQueue[i];
        if(first){
          self.context.fillStyle=self.settings.firstSnakeColor;
          first = false;
          self.context.fillRect(spot.x * self.boxWidth, spot.y * self.boxHeight, self.boxWidth, self.boxHeight);
          self.context.fillStyle=self.settings.restSnakeColor;
        }
        else{
          self.context.fillRect(spot.x * self.boxWidth, spot.y * self.boxHeight, self.boxWidth, self.boxHeight);
        }
      };

      self.context.fillStyle = self.settings.spotColor;
      self.context.fillRect(self.spot.x * self.boxWidth, self.spot.y * self.boxHeight, self.boxWidth, self.boxHeight);

    },


  });