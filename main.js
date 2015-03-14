$(function() {
    
    var raf = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame;


	function GameTime () {
		this.lastUpdate = 0;
		this.elapsedMs = 0;
	}

	GameTime.prototype.now = function() {
		var p = window.performance || {};
		p.now = p.now || new Date().getTime();
		return p.now();
	};

	GameTime.prototype.update = function() {
		this.elapsedMs = (this.now() - this.lastUpdate) / 1000.0;
		this.lastUpdate = this.now();
	};



	var DOMGame = {

		_width: 0,
		_height: 0,
		_lastOutputTime: 0,

		canvas: null,
    	ctx: null,

		gameTime: null,
    	rectangle: null,
    	keys: [],
    	obstacles: [],

		init: function() {
			// Binds
			this.update = this.update.bind(this);
			this.onKeyDown = this.onKeyDown.bind(this);
			this.onKeyUp = this.onKeyUp.bind(this);

			this.gameTime = new GameTime();
			this.initDOM();
			this.initEvents();
			this.start();
		},

		initDOM: function() {
			this.canvas = $('canvas')[0];
			this.ctx = this.canvas.getContext('2d');

			this._width = window.innerWidth;
			this._height = window.innerHeight;
			this.canvas.width = this._width;
			this.canvas.height = this._height;
		},

		initEvents: function() {
			$(window).on('keydown', this.onKeyDown);
			$(window).on('keyup', this.onKeyUp);
		},

		start: function() {
			this.rectangle = new Rectangle(new Vector(20,20), 40, 40);

			this.locateObstacles();

			// Start main loop
			this.update();
		},

		update: function() {
			// AnimationFrame loop
			raf(this.update);

			// Update functions
			this.rectangle.update(this);

			// output rectangle data
			this._lastOutputTime += this.gameTime.elapsedMs;
			if(this._lastOutputTime > 3){
				console.log(this.rectangle.vector);
				this._lastOutputTime = 0;
			}

			// update gameTime
			this.gameTime.update();

			// End with drawing everything
			this.draw();
		},

		draw: function() {
			// Clear canvas
			this.ctx.clearRect(0, 0, this._width, this._height);

			// Draw rectangle
			this.rectangle.draw(this.ctx);
		},

		locateObstacles: function() {
			var $obs = $('.obstacle');
			var that = this;
			$obs.each(function(index, element){
				that.obstacles.push(element.getBoundingClientRect());
			})
		},

		onKeyDown: function(e) {
			this.keys[e.keyCode] = true;
		},

		onKeyUp: function(e) {
			this.keys[e.keyCode] = false;
		}
	};




	function Rectangle (position, width, height) {
		this.position = position;
		this.velocity = new Vector(0,0);
		this.gravity = new Vector(0, 0.21875);

		this.width = width;
		this.height = height;
		this.inTheAir = false;
		this.isJumping = false;

		this.movement = 0;
		this.movementAccaleration = 1.5;
		this.maxVelocity = 5.0;		
		this.groundDragFactor = 0.48;

		// Jump factors 
		this.maxJumpTime = 0.20;
		this.jumpLaunchVelocity = 0.5;
		this.jumpControlPower = 0.14;
		this.jumpTime = 0;
	}

	Rectangle.prototype.draw = function(context) {
		context.save();

		context.beginPath();
		context.rect(this.position.x, this.position.y, this.width, this.height);
		context.stroke();

		context.restore();
	};

	Rectangle.prototype.update = function(game) {
		this._handleInputs(game);
		this._handlePyshics(game.gameTime);
		this._handleCollision(game.obstacles);
	};

	Rectangle.prototype._handlePyshics = function(gameTime) {
		this._DoJump(gameTime);

		// Horizontal pyshics
		this.velocity.x += this.movement * this.movementAccaleration;

		// Todo add airDrag
		this.velocity.x *= this.groundDragFactor;

		// Add base gravity
		this.velocity = this.velocity.add(this.gravity).truncate(this.maxVelocity);

		// Add velocity vector to positon 
		this.position = this.position.add(this.velocity);
	};

	Rectangle.prototype._DoJump = function(gameTime) {
		if(this.isJumping){
			this.jumpTime += gameTime.elapsedMs;

			if(this.jumpTime > 0.0 && this.jumpTime <= this.maxJumpTime){
				var y = this.jumpLaunchVelocity * (-1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
				this.velocity = this.velocity.add(new Vector(0, y));
			}
			else{
				this.jumpTime = 0;
				this.isJumping = false;
			}
		} 
		else{
			this.jumpTime = 0;
		}
	};

	Rectangle.prototype._handleInputs = function(game) {
		if(game.keys[37] == true) {
			this.movement = -1;
		}

		if(game.keys[38] == true && this.inTheAir == false){
			this.isJumping = true;
		}

		if(game.keys[39] == true){
			this.movement = 1;
		}
	};

	Rectangle.prototype._handleCollision = function(obstacles) {
		var aheadRectangle = {
			top: this.position.y, 
			left: this.position.x, 
			width: this.width, 
			height: this.height 
		};

		var collisions = checkCollisions(aheadRectangle, obstacles);

		if(collisions.length > 0){
			this.inTheAir = false;

			var that = this;
			collisions.forEach(function(obstacle){

				var diffX = (obstacle.left + obstacle.width / 2) - (that.position.x + that.width / 2);
				var diffY = (obstacle.top + obstacle.height / 2) - (that.position.y + that.height / 2);

				// Vertical collision
				if(Math.abs(diffX) > Math.abs(diffY)){
					// Obstacle located under
					if(diffY > 0 && that.velocity.y > 0){
						console.log("collision under");
						that.position.y = obstacle.top - that.height;
					}
					else{
						console.log("collision to the top");
						that.position.y = obstacle.top;
					}
				}
				// Horizontal collision
				else{
					if(diffX > 0 && that.velocity.x > 0){
						console.log("collision to the right");
						that.position.x = obstacle.left - that.width;
					}
					else{
						console.log("collision to the left");	
						that.position.x = obstacle.left;			
					}
				}
			});
		}else{
			this.inTheAir = true;
		}
	};


	// ===============================
	// ============ Utils ============
	// ===============================

	function checkCollisions(rectangle, obstacles){
		var obstaclesFound = [];

		obstacles.forEach(function(obstacle) {
			if(collision(rectangle, obstacle)){
				obstaclesFound.push(obstacle);
			}
		});

		return obstaclesFound;
	};

	function collision(r1, r2) {
		if(
			r1.left < r2.left + r2.width &&
			r1.left + r1.width > r2.left &&
			r1.top < r2.top + r2.height &&
			r1.top + r1.height > r2.top){
			return true;
		}

		return false;
	};

	DOMGame.init();
});