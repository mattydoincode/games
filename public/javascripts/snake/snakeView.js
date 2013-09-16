var SnakeView = Backbone.View.extend({

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "change #light": "changeColor"
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
      valueOfEating: 4,
      numScores: 5,
      darkColor: '#2C3E50',
      lightColor: '#FFFFFF'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'render', 'renderGrid', 'renderSnake');
      self.context = self.options.context;
      self.setUpDimensions(self.options.width, self.options.height);
      self.light = true;
      if(moment().hours()>20 || moment().hours() < 6){
        $('#light').click();
        self.changeColor();
      }
      self.isDev = self.options.isDev == 'true';
      
      self.incrementViews();
      self.readScores();
      self.paused = false;
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

    setUpDimensions: function (width, height) {
      var self = this;
      self.width = width;
      self.height = height;
      self.settings.gridY = Math.round(self.settings.gridX * (self.height / self.width));
      self.boxHeight = self.height / self.settings.gridY;
      self.boxWidth = self.width / self.settings.gridX;
    },

    changeColor: function() {
      var self = this;
      self.light = !self.light;

      if (self.light) {
        $('.canvasContainer').css('background', self.settings.lightColor);
      } else {
        $('.canvasContainer').css('background', self.settings.darkColor);
      }
    },

    incrementViews: function() {
      var self = this;
      if (self.isDev) {
        return;
      }
      if (self.tracking) {
        self.tracking.increment("views");
        self.tracking.save();
      } else {
        var Tracking = Parse.Object.extend("Tracking");
        var query = new Parse.Query(Tracking);
        query.get("JBkMU5Uhqm", {
          success: function(tracking) {
            self.tracking = tracking;
            tracking.increment("views");
            tracking.save();
          },
          error: function(object, error) {
            self.tracking = null;
          }
        });
      }
    },

    incrementPlays: function() {
      var self = this;
      if (self.isDev) {
        return;
      }
      if (self.tracking) {
        self.tracking.increment("plays");
        self.tracking.save();
      } else {
        var Tracking = Parse.Object.extend("Tracking");
        var query = new Parse.Query(Tracking);
        query.get("JBkMU5Uhqm", {
          success: function(tracking) {
            self.tracking = tracking;
            tracking.increment("plays");
            tracking.save();
          },
          error: function(object, error) {
            self.tracking = null;
          }
        });
      }
    },

    readScores: function() {
      var self = this;
      var HighScore = Parse.Object.extend("HighScore");
      var query = new Parse.Query(HighScore);
      query.limit(self.settings.numScores);
      query.descending("score");
      query.equalTo("game", "snake");
      query.find({
        success: function(results) {
          self.scores = results;
          self.displayScores();
        },
        error: function(error) {
          alert("Error: " + error.code + " " + error.message);
        }
      });
    },

    displayScores: function() {
      var self = this;
      var highscores = '';
      _.each(self.scores, function(score, index) {
        score.rank = index+1;
        score.username = score.attributes.username;
        if (score.username.length > 19) {
          score.username = score.username.substring(0, 16) + '...';
        }
        score.score = score.attributes.score;
        highscores += $.Mustache.render('score', score);
      });
      $("#daScores").html(highscores);
    },

    startGame: function () {
      var self = this;
      self.snakeQueue = [];
      self.snakeQueue.push({x: 20, y: 5});
      self.spotPlaced = false;
      self.placeRandomSpot();
      self.inputQueue = [];
      self.extras = 0;
      self.score = 0;
      //key inputs
      self.inputs = [];
      // 0 = not pressed, 1 = pressed, 2 = held?
      self.up = 0;
      self.down = 0;
      self.left = 0;
      self.right = 0;
      self.incrementPlays();

      self.direction = self.settings.startDirection;

      $('.container-fluid').hide();

    },

    // Re-render the titles of the todo item.
    render: function() {
      var self = this;
      self.clearCanvas();

      if(self.waiting) {
        self.writeText();
      }
      else if(self.paused){
        self.writePauseText();
      }
      else {
        //optional
        //self.renderGrid();
        self.checkInputs();
        self.moveSnake();
        self.renderSnake();
        self.writeScore();
      }

      setTimeout(function (){ self.render(); }, self.settings.rate);
    },

    addScore: function() {
      var self = this;

      var username = $('#username').val();
      var score = parseInt($('#newscore').html());

      if (username == '' || score == 0) {
        return;
      }

      var HighScore = Parse.Object.extend("HighScore");
      var newScore = new HighScore();

      newScore.set("score", score);
      newScore.set("username", username);
      newScore.set("game", "snake");

      newScore.save(null, {
        success: function(gameScore) {
          // alert('saved!');
          // if it was a high score, refresh them
          self.readScores();
        },
        error: function(gameScore, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and description.
          alert('Failed to create new object, with error code: ' + error.description);
        }
      });

      $('#newscore').html('');
      $('.newscore-row').hide();
      $('.lastscore-row').show();
    },

    gameOver: function() {
      var self = this;

      // fill in the new score
      $('#lastscore').html(self.score);
      $('#newscore').html(self.score);

      if (self.score > self.scores[self.scores.length-1].score) {
        $('.newscore-row').show();
        $('.lastscore-row').hide();
      } else {
        $('.lastscore-row').show();
      }

      // show scores
      $('.container-fluid').fadeIn('slow');

    },

    writeText: function () {
      var self = this;
      self.context.font="30px Arial";
      self.context.fillStyle = self.light ? self.settings.darkColor : self.settings.lightColor;
      self.context.fillText("press space to begin",self.width /5,self.height/2 - 15);
      self.context.font="15px Arial";
      self.context.fillText("use arrow keys or AWSD",self.width /5,self.height/2 + 40);
      self.context.fillText("during game, space pauses",self.width /5,self.height/2 + 60);
    },

    writePauseText: function () {
      var self = this;
      self.context.font="30px Arial";
      self.context.fillStyle = self.light ? self.settings.darkColor : self.settings.lightColor;
      self.context.fillText("press space to continue",self.height /5,self.height/2 - 15);
    },

    writeScore: function() {
      var self = this;
      self.context.font="30px Arial";
      self.context.fillStyle = self.light ? self.settings.darkColor : self.settings.lightColor;
      self.context.fillText(self.score, 10, 40);
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
        if(self.waiting && !$('#username').is(':focus')){
          self.startGame();
          self.waiting = false;
        }
        else {
          if(!self.waiting){
            self.paused = !self.paused;
          }
        }
      }

      if (key==37 || key==65){
        if(self.left==0){
          self.left=1;
        }
      }
      else if(key==38 || key==87){
        if(self.up==0){
          self.up=1;
        }
      }
      else if(key==39 || key==68){
        if(self.right==0){
          self.right=1;
        }
      }
      else if(key==40 || key==83){
        if(self.down==0){
          self.down=1;
        }
      }
      else if(key == 13){
        if (self.waiting) {
          self.addScore();
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
        self.right=0;
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
        // got food
        self.score += 10;
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
      
      if(startOver) {
        self.waiting = true;
        self.gameOver();
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
        else {
          self.context.fillRect(spot.x * self.boxWidth, spot.y * self.boxHeight, self.boxWidth, self.boxHeight);
        }
      }

      self.context.fillStyle = self.settings.spotColor;
      self.context.fillRect(self.spot.x * self.boxWidth, self.spot.y * self.boxHeight, self.boxWidth, self.boxHeight);

    }


  });