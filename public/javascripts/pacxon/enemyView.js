var EnemyView = Backbone.View.extend({


    initialize: function() {
      var self = this;
      self.spot = self.options.spot;
    },

    fillAlgorithm: function (grid) {
      var self = this;
      foundMore = true;
      var height = grid[0].length;
      var width = grid.length;
      var hashSet = {};
      console.log(width);

      for(var i = 0; i < width; i++) {
        for(var j = 0; j < height; j++) {
          if(grid[i][j].status=="cleared"){
            hashSet[self.performHash({x: i, y: j})] = true;
          }
        }
      }
      var queue = [];
      var spotsLeftOpen = [];
      hashSet[self.performHash(self.spot)] = true;
      queue.push(self.spot);
      while(foundMore){
        foundMore = false;
        while(newSpot = queue.shift()){
          var up = {x: newSpot.x, y:newSpot.y+1};
          if(!(up.y > height-2) && !hashSet[self.performHash(up)]){
            hashSet[self.performHash(up)] = true;
            foundMore = true;
            spotsLeftOpen.push(up);
            queue.push(up);
          }
          var down = {x: newSpot.x, y:newSpot.y-1};
          if(!(down.y == 0) && !hashSet[self.performHash(down)]){
            hashSet[self.performHash(down)] = true;
            foundMore = true;
            spotsLeftOpen.push(down);
            queue.push(down);
          }
          var left = {x: newSpot.x-1, y:newSpot.y};
          if(left.x==2 && left.y==2){
            console.log('fuck');
          }
          if(!(left.x  == 0) && !hashSet[self.performHash(left)]){
            hashSet[self.performHash(left)] = true;
            foundMore = true;
            spotsLeftOpen.push(left);
            queue.push(left);
          }
          var right = {x: newSpot.x+1, y:newSpot.y};
          if(!(right.x > width-2) && !hashSet[self.performHash(right)]){
            hashSet[self.performHash(right)] = true;
            foundMore = true;
            spotsLeftOpen.push(right);
            queue.push(right);
          }
        }
      }
      return spotsLeftOpen;

    },

    performHash: function (spot){
      return spot.x + spot.y * 1000;
    },

    move: function () {
      var self = this;
    }


  });