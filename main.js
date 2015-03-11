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

		this.maxVelocity = 5.0;
		//this.gravity = 0.21875;
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

		this._handleCollision(game);
		this._handleInputs(game);
		this._handleJump(game)

		// Add base gravity
		this.velocity = this.velocity.add(this.gravity);

		// Add velocity vector to positon 
		this.position = this.position.add(this.velocity.truncate(this.maxVelocity));
	};

	Rectangle.prototype._handleJump = function(game) {
		if(this.isJumping){
			this.jumpTime += game.gameTime.elapsedMs;

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
			this.position.x--;
		}

		if(game.keys[38] == true && this.inTheAir == false){
			this.isJumping = true;
		}

		if(game.keys[39] == true){
			this.position.x++;
			
		}
	};

	Rectangle.prototype._handleCollision = function(game) {
		var tv = this.velocity.isZero ? new Vector(0,0) : this.velocity.normalized();
		tv = tv.scale(0.21875 * this.velocity.length() / this.maxVelocity);

		var ahead = this.position.add(tv);

		var aheadRectangle = {
			top: ahead.y, 
			left: ahead.x, 
			width: this.width, 
			height: this.height 
		};

		var collisions = checkCollisions(aheadRectangle, game.obstacles);

		if(collisions.length > 0){
			this.inTheAir = false;

			// Clear velocity downforce
			this.gravity.y = 0;
			this.velocity.y = 0;
		}else{
			this.gravity.y = 0.21875;
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