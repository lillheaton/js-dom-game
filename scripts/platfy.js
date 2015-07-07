define([
	'underscore',
	'events',
	'classy',

	'game',
	'player'
], function(
	_,
	Events,
	Classy,

	Game,
	Player
){

	var Platfy = Game.extend({

		player: null,

		// @constructor
		__init__: function() {
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
		}
	});

	return Platfy;
});