var CanvasView = Backbone.View.extend({

    // Cache the template function for a single item.
    //template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      var self = this;
      _.bindAll(self, 'setUpDimensions');
      self.canvas = document.getElementById("canvas");
      self.context = self.canvas.getContext("2d");
      var w = $(window);
      var height = w.innerHeight();
      var width = w.innerWidth();
      self.setUpDimensions(width,height);
      self.falldown = new FalldownView({context: self.context, width: width, height: height, el: $('.game-wrapper'), isDev: self.options.isDev });

      $(window).resize(function () {
        if(self.falldown.waiting){
          var w = $(window);
          var h = w.innerHeight();
          var ww = w.innerWidth();
          self.setUpDimensions(ww,h);
          self.falldown.setUpDimensions(ww,h);
        }
      });
    },

    // Re-render the titles of the todo item.
    setUpDimensions: function(width, height) {
      var self = this;
      self.$el.height(height);
      self.$el.width(width);
      self.canvas.width  = width;
      self.canvas.height = height;
      $(self.canvas).height(height);
      $(self.canvas).width(width);
    }

  });