define([
	'classy',

	'objects/rectangle',
	'victor'
], function(
	Classy,

	Rectangle,
	Vector
){

	var Player = Classy.extend({

		game: null,
		rectangle: null,

		// @constructor
		__init__: function(game) {
			this.game = game;
			this.init();
		},

		init: function(){
			this.rectangle = new Rectangle(new Vector(20,20), 40, 40);
		},

		update: function(time){
			this.handleInputs();
		},

		draw: function(time, ctx){
			this.rectangle.draw(time, ctx);
		},

		handleInputs: function(){
			if(this.game.keys[37] == true) {
				this.rectangle.position.x -= 10;
			}

			// if(this.game.keys[38] == true && this.inTheAir == false){
			// 	this.isJumping = true;
			// }

			if(this.game.keys[39] == true){
				this.rectangle.position.x += 10;
			}
		}
	});

	return Player;
});