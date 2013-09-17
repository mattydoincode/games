var CubeView = Backbone.View.extend({


    dimensions: {
      radius: 200
    },
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'render');
      self.center = self.options.center;
      self.context = self.options.context;
      self.setUpPoints();
      self.style = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
        a: .5,
      }
    },


    setUpPoints: function () {
      var self = this;
      self.frontSquare = [];
      self.backSquare = [];
      var c = self.center;
      var r = self.dimensions.radius;
      self.frontSquare.push({x:c.x - r,y:c.y + r,z:c.z + r});
      self.frontSquare.push({x:c.x + r,y:c.y + r,z:c.z + r});
      self.frontSquare.push({x:c.x + r,y:c.y + r,z:c.z - r});
      self.frontSquare.push({x:c.x - r,y:c.y + r,z:c.z - r});

      self.backSquare.push({x:c.x - r,y:c.y - r,z:c.z + r});
      self.backSquare.push({x:c.x + r,y:c.y - r,z:c.z + r});
      self.backSquare.push({x:c.x + r,y:c.y - r,z:c.z - r});
      self.backSquare.push({x:c.x - r,y:c.y - r,z:c.z - r});
    },

    move: function (xDelta, yDelta) {
      var self = this;
      for(var i = 0 ; i < 4; i++){
        self.frontSquare[i].y+=yDelta;
        self.frontSquare[i].x+=xDelta;
        self.backSquare[i].y+=yDelta;
        self.backSquare[i].x+=xDelta;
      }
    }
,

    draw: function () {
      var self = this;
      self.transformFront = [];
      self.transformBack = [];
      _.each(self.frontSquare, function (point){
        self.transformFront.push(physics.transform(point.x,point.y,point.z));
      });

      _.each(self.backSquare, function (point){
        self.transformBack.push(physics.transform(point.x,point.y,point.z));
      });

      self.context.fillStyle = "rgba(" +self.style.r + "," + self.style.g + "," + self.style.b + "," + self.style.a + ")";
      self.context.beginPath();
      var first = self.transformFront[3];
      self.context.moveTo(first.x, first.z);
      _.each(self.transformFront, function (point) {
        self.context.lineTo(point.x, point.z);
      });
      self.context.closePath();
      self.context.fill();
      self.context.stroke();

      self.context.beginPath();
      var first = self.transformBack[3];
      self.context.moveTo(first.x, first.z);
      _.each(self.transformBack, function (point) {
        self.context.lineTo(point.x, point.z);
      });
      self.context.stroke();

      for(var i = 0; i < 4; i++){
        self.context.beginPath();
        self.context.moveTo(self.transformFront[i].x, self.transformFront[i].z);
        self.context.lineTo(self.transformBack[i].x, self.transformBack[i].z);
        self.context.stroke();
      }

    }



  });