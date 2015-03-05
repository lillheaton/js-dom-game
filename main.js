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
			//var $kalle = $('.box1')[0];
			//console.log($kalle.getBoundingClientRect());

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




	function Rectangle (vector, width, height) {
		this.vector = vector;
		this.width = width;
		this.height = height;
	}

	Rectangle.prototype.draw = function(context) {
		context.save();

		context.beginPath();
		context.rect(this.vector.x, this.vector.y, this.width, this.height);
		context.stroke();

		context.restore();
	};

	Rectangle.prototype.update = function(game) {
		if(game.keys[37] == true) {
			this.vector.x--;
		}

		if(game.keys[38] == true){
			this.vector.y--;
		}

		if(game.keys[39] == true){
			this.vector.x++;
		}

		if(game.keys[40] == true){
			this.vector.y++;
		}
	};

	DOMGame.init();
});
