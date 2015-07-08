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

		// Unit variables
		velocity: new Vector(0,0),
		maxVelocity: 6.0,
		movementX: 0,
		acceleration: 0.046875,
		groundFriction: 0.9,

		// Constants
		gravity: new Vector(0, 0.21875),

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
			this.calculatePhysics(time);
		},

		draw: function(time, ctx){
			this.rectangle.draw(time, ctx);
		},




		calculatePhysics: function(time){
			// TODO: Handle jump

			// Horizontal acceleration
			var desiredAccX = this.movementX * this.acceleration * this.maxVelocity;
			this.velocity.add(new Vector(desiredAccX, 0));

			// Ground friction
			if(this.movementX == 0)
				this.velocity.multiply(new Vector(this.groundFriction, 0));

			this.velocity = this.truncateVector(this.velocity, this.maxVelocity);

			this.rectangle.position.add(this.velocity);
		},

		handleInputs: function(){
			if(this.game.keys[37] == true)
				this.movementX = -1;
			else if(this.game.keys[39] == true)
				this.movementX = 1;
			else
				this.movementX = 0;

			// if(this.game.keys[38] == true && this.inTheAir == false){
			// 	this.isJumping = true;
			// }
		},

		truncateVector: function(vector, max){
			var i = max / vector.length();
			i = i < 1.0 ? i : 1.0;
			return vector.multiply(new Vector(i, i));
		}
	});

	return Player;
});