var PacView = Backbone.View.extend({

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {

    },

    settings: {
      gridX: 50,
      gridY: 0,
      gridColor: "#ddd",
      firstSnakeColor: "004FFF",
      restSnakeColor: "#BFC5FF",
      clearColor: "#68A9FF",
      blankColor: "#fff",
      spotColor: "red",
      rate: 80,
      maxInputs: 1000,
      startDirection: 2, // right,
      valueOfEating: 4,
      numEnemies: 1

    },



    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'render', 'fillSpace', 'registerPath', 'renderGrid', 'renderSnake');
      self.context = self.options.context;
      self.width = self.options.width;
      self.height = self.options.height;
      self.settings.gridY = Math.round(self.settings.gridX * (self.height / self.width));
      self.boxHeight = self.height / self.settings.gridY;
      self.boxWidth = self.width / self.settings.gridX;
      $(window).keydown(function (e) {
        self.registerInput(e.which);
      });
      $(window).keyup(function (e) {
        self.killInput(e.which);
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
      self.setUpEnemies();
      self.initializeGameGrid();
      self.snakeQueue.push({x: 0, y: 0});
      self.inputQueue = [];
      self.extras = 0;
      //this is whether or not you're in open space
      self.autoMove = false;
      //key inputs
      self.inputs = [];
      // 0 = not pressed, 1 = pressed, 2 = held?
      self.up = 0;
      self.down = 0;
      self.left = 0;
      self.right = 0;


      self.direction = self.settings.startDirection;
    },

    setUpEnemies: function () {
      var self = this;
      self.enemies = [];
      for(var i = 0; i < self.settings.numEnemies; i++){
        self.enemies.push(new EnemyView({
          spot: {
            x:physics.getRandomInt(1,self.settings.gridX-2),
            y:physics.getRandomInt(1,self.settings.gridY-2)
          }
        }));
      }
    },

    initializeGameGrid: function () {
      var self = this;
      self.gameGrid = [];
      for(var i = 0; i < self.settings.gridX; i++) {
        self.gameGrid.push([]);
        for(var j = 0; j < self.settings.gridY; j++) {
            self.gameGrid[i][j] = {status: "blank"};
        }
      }
      self.setBorder();
    },

    setBorder: function () {
      var self = this;
      //top/bottom
      for (var i = 0; i < self.settings.gridX; i++){
        self.gameGrid[i][0] = {
          status: "cleared"
        };
        self.gameGrid[i][self.settings.gridY-1] = {
          status: "cleared"
        };
      }
      //left rightObject
      for (var i = 0; i < self.settings.gridY; i++){
        self.gameGrid[0][i] = {
          status: "cleared"
        };
        self.gameGrid[self.settings.gridX-1][i] = {
          status: "cleared"
        };
      }
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
        self.renderGrid();
        self.checkInputs();
        _.each(self.enemies, function (guy){
          guy.move();
        });
        if(self.autoMove){
          self.autoMoveSnake();
        }
        else{
          self.stepMoveSnake();
        }
        self.drawEnemies();
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

    clearCanvas: function () {
      var self = this;
      self.context.clearRect(0,0, self.width , self.height);
    },

    drawEnemies: function () {
      var self = this;
       self.context.fillStyle = "red";
       _.each(self.enemies, function (guy){
          self.context.fillRect(guy.spot.x * self.boxWidth, guy.spot.y * self.boxHeight, self.boxWidth, self.boxHeight);
        });
    },

    registerInput: function (key) {
      var self = this;
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

    killInput: function (key) {
      var self = this;
      if (key==37){
          self.leftDead=true;
      }
      else if(key==38){
          self.upDead=true;
      }
      else if(key==39){
          self.rightDead=true;
      }
      else if(key==40){
          self.downDead=true;
      }
    },


    checkInputs: function () {
      var self = this;
      if(self.inputs.length > self.settings.maxInputs){
        return;
      }
      //0 = left
      if(self.left==1){
        self.inputs.push(0);
      }
      //1  = up
      else if(self.up==1){
        self.inputs.push(1);
      }
      //2 = right
      else if(self.right==1){
        self.inputs.push(2);
      }
      //3 = down
      else if(self.down==1){
        self.inputs.push(3);
      }

      if(self.leftDead){
        self.left = 0;
        self.leftDead = false;
      }
      if(self.upDead){
        self.up = 0;
        self.upDead = false;
      }
      if(self.rightDead){
        self.right = 0;
        self.rightDead = false;
      }
      if(self.downDead){
        self.down = 0;
        self.downDead = false;
      }

    },


    stepMoveSnake: function () {
      var self = this;
      if(self.inputs.length > 0){
        //then we must move the snake in a different direction for shizzle
        self.direction  = self.inputs.shift();
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

        if(newSpot.x >= self.settings.gridX || newSpot.x < 0 || newSpot.y >=self.settings.gridY || newSpot.y < 0){
          newSpot = oldSpot;  
        }
        if(self.gameGrid[newSpot.x][newSpot.y].status=="blank"){
          self.autoMove = true;
        }

        self.snakeQueue.shift();
        self.snakeQueue.push(newSpot);
      }
      
    },

    autoMoveSnake: function () {
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

      var startOver = _.any(self.snakeQueue, function (guy) {
        return guy.x==newSpot.x && guy.y==newSpot.y;
      });

      if(self.gameGrid[newSpot.x][newSpot.y].status=="cleared"){
          self.autoMove = false;
          self.registerPath();
      }
      else{
        self.gameGrid[newSpot.x][newSpot.y].status=="temporary";
      }
      self.snakeQueue.push(newSpot);

      if(startOver){
        self.waiting = true;
      }
      


    },

    registerPath: function () {
      var self = this;
      for(var i = 0; i < self.snakeQueue.length; i++){
        var spot = self.snakeQueue[i];
        self.gameGrid[spot.x][spot.y] = {status: "cleared"};
      }
      var last = self.snakeQueue[self.snakeQueue.length-1];
      self.snakeQueue = [];
      self.fillSpace();
    },

    fillSpace: function () {
      var self = this;
      var grid = self.gameGrid;
      _.each(self.enemies, function (badguy){
        var clearSpots = badguy.fillAlgorithm(grid);
        _.each(clearSpots, function (spot){
          grid[spot.x][spot.y].status = "keepblank";
        });
      });
      for(var i = 0; i < self.settings.gridX; i++) {
        for(var j = 0; j < self.settings.gridY; j++) {
          if(grid[i][j].status=="blank"){
            grid[i][j].status = "cleared";
          }
          else if(grid[i][j].status=="keepblank"){
            grid[i][j].status="blank";
          }
        }
      }
    },

    renderGrid: function () {
      var self = this;
      self.context.strokeStyle = "#ddd";

    
      for(var i = 0; i < self.settings.gridX; i++) {
        for(var j = 0; j < self.settings.gridY; j++) {
          //x, y, w, h
          if(self.gameGrid[i][j].status=="blank"){
            self.context.fillStyle = self.settings.blankColor;
          }
          else if(self.gameGrid[i][j].status=="cleared"){
            self.context.fillStyle = self.settings.clearColor;
          }
          else if(self.gameGrid[i][j].status=="temporary"){
            self.context.fillStyle = self.settings.restSnakeColor;
          }
          self.context.strokeRect(i * self.boxWidth, j * self.boxHeight, self.boxWidth, self.boxHeight);
          self.context.fillRect(i * self.boxWidth, j * self.boxHeight, self.boxWidth, self.boxHeight);
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

    },


  });