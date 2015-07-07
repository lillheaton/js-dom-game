define([
	'classy'
], function(
	Classy
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
			ctx.rect(this.position.x, this.position.y, this.width, this.height);
			ctx.stroke();

			ctx.restore();
	    },

	    collision: function(rectangle){
			if (this.left < rectangle.left + rectangle.width &&
				this.left + this.width > rectangle.left &&
				this.top < rectangle.top + rectangle.height &&
				this.top + this.height > rectangle.top) {
					return true;
			}
			return false;
	    }
	});

	return Rectangle;
});