define([
	'classy',
	'underscore',

	'objects/rectangle',
	'victor'
], function(
	Classy,
	_,

	Rectangle,
	Vector
){

	var Player = Classy.extend({

		game: null,
		rectangle: null,

		// Unit variables
		velocity: new Vector(0,0),		
		movementX: 0,
		jumpTime: 0,
		isJumping: false,
		inTheAir: true,
		
		// Constants
		maxVelocity: 7.0,
		acceleration: 0.046875,
		groundFriction: 0.9,
		gravity: 0.51875,
		maxJumpTime: 0.60,
		jumpLaunchVelocity: 0.9,
		jumpControlPower: 0.5,

		// @constructor
		__init__: function(game) {
			this.game = game;
			this.init();
		},

		init: function(){
			this.rectangle = new Rectangle(new Vector(800,800), 40, 40);
		},

		update: function(time){
			this.handleInputs();
			this.calculatePhysics(time);
			this.collisionDetection(time);
		},

		draw: function(time, ctx){
			this.rectangle.draw(time, ctx);
		},




		calculatePhysics: function(time){
			this.calculateJump(time);

			var desiredAccX = this.movementX * this.acceleration * this.maxVelocity;
			this.velocity.add(new Vector(desiredAccX, this.gravity));

			// Ground friction
			if(this.movementX == 0)
				this.velocity.multiply(new Vector(this.groundFriction, 1));

			this.velocity = this.truncateVector(this.velocity, this.maxVelocity);

			this.rectangle.position.add(this.velocity);
		},

		calculateJump: function(time) {
			if(this.isJumping){
				this.jumpTime += time.elapsedMs;

				if(this.jumpTime > 0.0 && this.jumpTime <= this.maxJumpTime){
					var y = this.jumpLaunchVelocity * (-1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
					this.velocity = this.velocity.add(new Vector(0, y));
				}
				else{
					this.jumpTime = 0;
					this.isJumping = false;
				}
			}
		},

		collisionDetection: function(time) {
			var collisions = [], 
				that = this;

			_.each(this.game.obstacles, function(obst) {
				var w = 0.5 * (that.rectangle.width + obst.width);
				var h = 0.5 * (that.rectangle.height + obst.height);
				var dx = that.rectangle.center().x - obst.center().x;
				var dy = that.rectangle.center().y - obst.center().y;

				if (Math.abs(dx) <= w && Math.abs(dy) <= h)
				{
				    /* collision! */
				    var wy = w * dy;
				    var hx = h * dx;

				    if (wy > hx){
				    	if (wy > -hx){
							// console.log("bottom");
				        	that.rectangle.position.y = obst.position.y + obst.height;
				        }
				        else{
							// console.log("left");	
				        	that.rectangle.position.x = obst.position.x - that.rectangle.width;
				        }
				    }
				    else{
				    	if (wy > -hx){
				    		// console.log("right");
				        	that.rectangle.position.x = obst.position.x + obst.width;
				    	}
				        else{
				        	// console.log("top");
				        	that.rectangle.position.y = obst.position.y - that.rectangle.height;
				        	that.inTheAir = false;
				        }
			        }
				}
			});
		},

		handleInputs: function(){
			if(this.game.keys[37] == true)
				this.movementX = -1;
			else if(this.game.keys[39] == true)
				this.movementX = 1;
			else
				this.movementX = 0;

			if(this.game.keys[38] == true && this.inTheAir == false){
				this.isJumping = true;
				this.inTheAir = true;
			}
		},

		truncateVector: function(vector, max){
			var i = max / vector.length();
			i = i < 1.0 ? i : 1.0;
			return vector.multiply(new Vector(i, i));
		}
	});

	return Player;
});