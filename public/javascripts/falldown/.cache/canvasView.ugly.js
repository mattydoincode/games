var CanvasView=Backbone.View.extend({events:{},initialize:function(){var e=this;_.bindAll(e,"setUpDimensions"),e.canvas=document.getElementById("canvas"),e.context=e.canvas.getContext("2d");var t=$(window),n=t.innerHeight(),r=t.innerWidth();e.setUpDimensions(r,n),e.falldown=new FalldownView({context:e.context,width:r,height:n,el:$(".game-wrapper"),isDev:e.options.isDev}),$(window).resize(function(){if(e.falldown.waiting){var t=$(window),n=t.innerHeight(),r=t.innerWidth();e.setUpDimensions(r,n),e.falldown.setUpDimensions(r,n)}})},setUpDimensions:function(e,t){var n=this;n.$el.height(t),n.$el.width(e),n.canvas.width=e,n.canvas.height=t,$(n.canvas).height(t),$(n.canvas).width(e)}})