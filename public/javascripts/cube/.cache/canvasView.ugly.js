var CanvasView=Backbone.View.extend({events:{},initialize:function(){var e=this;_.bindAll(e,"setUpDimensions"),e.canvas=document.getElementById("canvas"),e.context=e.canvas.getContext("2d");var t=$(window),n=t.innerHeight(),r=t.innerWidth();e.setUpDimensions(r,n),e.game=new GameView({context:e.context,width:r,height:n,el:$(window)}),$(window).resize(function(){if(e.game.waiting){var t=$(window),n=t.innerHeight(),r=t.innerWidth();e.setUpDimensions(r,n),e.game.setUpDimensions(r,n)}})},setUpDimensions:function(e,t){var n=this;n.$el.height(t),n.$el.width(e),n.canvas.width=e,n.canvas.height=t,$(n.canvas).height(t),$(n.canvas).width(e),physics.cameraX=e/2,physics.cameraZ=t/2,physics.canvasHeight=t,physics.canvasWidth=e,physics.setUp()}})