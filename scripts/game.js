define([
	'jquery',
	'underscore',
	'events',
	'classy',

	'time'
], function(
	$,
	_,
	Events,
	Classy,

	GameTime
){

	var Game = Classy.extend({

		// raf: window.requestAnimationFrame ||
		// 	window.webkitRequestAnimationFrame ||
		// 	window.mozRequestAnimationFrame ||
		// 	window.msRequestAnimationFrame,

		_gameTime: null,
		canvas: null,
    	ctx: null,
    	keys: [],

		// @constructor
		__init__: function() {
			// Binds
			this._update = this._update.bind(this);
			this._onKeyDown = this._onKeyDown.bind(this);
			this._onKeyUp = this._onKeyUp.bind(this);

			// Initialization
			this._gameTime = new GameTime();
			this._initDOM();
			this._initEvents();
			this._start();
	    },

	    _initDOM: function() {
	    	this.canvas = $('canvas')[0];
			this.ctx = this.canvas.getContext('2d');

			this._width = window.innerWidth;
			this._height = window.innerHeight;
			this.canvas.width = this._width;
			this.canvas.height = this._height;
	    },

	    _initEvents: function(){
	    	$(window).on('keydown', this._onKeyDown);
			$(window).on('keyup', this._onKeyUp);
	    },

	    _start: function() {
	    	this._update();
	    },

	    _update: function() {
			// AnimationFrame loop
			requestAnimationFrame(this._update);

			// Update
			this.update(this._gameTime);

			// Update gameTime
			this._gameTime.update();

			// Draw
			this.draw(this._gameTime, this.ctx);
	    },

	    _onKeyDown: function(e) {
			this.keys[e.keyCode] = true;
		},

		_onKeyUp: function(e) {
			this.keys[e.keyCode] = false;
		},

		update: function(time) {},
		draw: function(time, ctx) {}
	});

	return Game;
});