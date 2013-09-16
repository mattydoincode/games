var GameView=Backbone.View.extend({events:{keyup:"registerUp",keydown:"registerDown"},settings:{newCubesPerFrame:2,forwardSpeed:200,sideSpeed:45,cameraHeight:5,cubeXSpread:1e4,frameRate:50,anglePerFrame:Math.PI/100,maxAngle:Math.PI/17},registerDown:function(e){var t=this;e.which==37?t.left=!0:e.which==39&&(t.right=!0)},registerUp:function(e){var t=this;e.which==37?t.left=!1:e.which==39&&(t.right=!1)},initialize:function(){var e=this;_.bindAll(e,"setUpDimensions","render"),e.context=e.options.context,e.height=e.options.height,e.width=e.options.width,e.setUpNewGame()},render:function(){var e=this;e.addNewCubes(),e.context.clearRect(-e.width,-e.height,e.width*3,e.height*3),e.rotateCanvas(),e.moveCubes(),e.drawHorizon(),e.drawCubes(),setTimeout(function(){e.render()},e.settings.frameRate)},setUpNewGame:function(){var e=this;e.cubes=[],e.render(),e.right=!1,e.left=!1,e.currentAngle=0,e.currentTurn=0},addNewCubes:function(){var e=this;for(var t=0;t<e.settings.newCubesPerFrame;t++){var n=Math.random()*e.settings.cubeXSpread*2-e.settings.cubeXSpread,r=new CubeView({center:{x:n,y:0,z:0},context:e.context});e.cubes.push(r)}},moveCubes:function(){var e=this;_.each(e.cubes,function(t){t.move(e.currentTurn,e.settings.forwardSpeed)});for(var t=0;t<e.cubes.length;t++)e.cubes[t].frontSquare[0].y>12e3&&(e.cubes[t]=null);e.cubes=_.compact(e.cubes)},drawHorizon:function(){var e=this;e.context.fillStyle="#ddd",e.context.fillRect(-1*e.width/2,-1*e.height/2,e.width*2,e.height),e.context.fillStyle="#666",e.context.fillRect(-1*e.width/2,e.height/2,e.width*2,e.height)},drawCubes:function(){var e=this;_.each(e.cubes,function(e){e.draw()})},rotateCanvas:function(){var e=this;e.currentTurn=e.currentAngle/e.settings.maxAngle*e.settings.sideSpeed;if(e.left){if(e.currentAngle>=e.settings.maxAngle)return;e.currentAngle<0?(e.context.translate(e.width/2,e.height/2),e.context.rotate(2*e.settings.anglePerFrame),e.currentAngle+=2*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2)):(e.context.translate(e.width/2,e.height/2),e.context.rotate(1*e.settings.anglePerFrame),e.currentAngle+=1*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2))}else if(e.right){if(e.currentAngle<=e.settings.maxAngle*-1)return;e.currentAngle>0?(e.context.translate(e.width/2,e.height/2),e.context.rotate(-2*e.settings.anglePerFrame),e.currentAngle+=-2*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2)):(e.context.translate(e.width/2,e.height/2),e.context.rotate(-1*e.settings.anglePerFrame),e.currentAngle+=-1*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2))}else e.currentAngle>=e.settings.anglePerFrame?(e.context.translate(e.width/2,e.height/2),e.context.rotate(-1*e.settings.anglePerFrame),e.currentAngle+=-1*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2)):e.currentAngle<=-1*e.settings.anglePerFrame?(e.context.translate(e.width/2,e.height/2),e.context.rotate(1*e.settings.anglePerFrame),e.currentAngle+=1*e.settings.anglePerFrame,e.context.translate(-1*e.width/2,-1*e.height/2)):e.currentAngle!=0&&(e.context.translate(e.width/2,e.height/2),e.context.rotate(e.currentAngle*-1),e.currentAngle=0,e.context.translate(-1*e.width/2,-1*e.height/2))},setUpDimensions:function(e,t){}})