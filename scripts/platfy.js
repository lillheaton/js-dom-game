define([
	'jquery',	
	'events',
	'classy',

	'game',
	'player',
	'objects/rectangle',
	'victor'
], function(
	$,
	Events,
	Classy,

	Game,
	Player,
	Rectangle,
	Vector
){

	var Platfy = Game.extend({

		player: null,
		obstacles: [],

		// @constructor
		__init__: function() {
			this.locateObstacles();
			this.player = new Player(this);
			this.supr();
		},

		update:function(time) {
			this.player.update(time);
		},

		draw: function(time, ctx) {
			// Clear canvas
			this.ctx.clearRect(0, 0, this._width, this._height);
			this.player.draw(time, ctx);
		},

		locateObstacles: function() {
			var $obs = $('.obstacle');
			var that = this;
			$obs.each(function(index, element){
				var domRect = element.getBoundingClientRect();
				that.obstacles.push(new Rectangle(new Vector(domRect.left, domRect.top), domRect.width, domRect.height));
			})
		}
	});

	return Platfy;
});