var physics = {

	
	cameraX: 0,
	cameraY: 10000,
	eyeY: 12000,
	cameraZ: 0,
	scale: 1,
	canvasHeight: 1000,
	canvasWidth: 1400,


	setUp: function () {
		eyeY = (this.canvasWidth/2)/Math.tan(30) + this.cameraY;
	},

	transform: function (x,y,z) {
		//DON'T EVEN TRY, SHIT'S FROM WIKIPEDIA
		var Az = this.eyeY - y;
		var Bz = this.eyeY - this.cameraY;
		var Ax = x;
		var Bx = Ax * (Bz/Az) * this.scale;

		var Ay = z;
		var By = Ay * (Bz/Az) * this.scale; 

		By = (By * -1) + (this.canvasHeight/2);
		Bx  = Bx + (this.canvasWidth/2);
		return {x: Bx, z: By};
	}
}