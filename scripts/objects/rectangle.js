define([
	'classy',
	'victor'
], function(
	Classy,
	Vector
){

	var Rectangle = Classy.extend({

		position: null,
		width: 0,
		height: 0,

		// @constructor
		__init__: function(position, width, height) {
			this.position = position;
			this.width = width;
			this.height = height;
	    },

	    draw: function(time, ctx) {
	    	ctx.save();

			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
			ctx.stroke();

			ctx.restore();
	    },

	    center: function(){
	    	return new Vector(this.position.x + this.width / 2, this.position.y + this.height / 2);
	    },

	    collide: function(rectangle){
			if (this.position.x < rectangle.position.x + rectangle.width &&
				this.position.x + this.width > rectangle.position.x &&
				this.position.y < rectangle.position.y + rectangle.height &&
				this.position.y + this.height > rectangle.position.y) {
					return true;
			}
			return false;
	    }
	});

	return Rectangle;
});