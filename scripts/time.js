define(['classy'], function(Classy){

	var GameTime = Classy.extend({
		lastUpdate: 0,
		elapsedMs: 0,

		now: function(){
			var p = window.performance || {};
			p.now = p.now || new Date().getTime();
			return p.now();
		},

		update: function(){
			this.elapsedMs = (this.now() - this.lastUpdate) / 1000.0;
			this.lastUpdate = this.now();
		}
	});

	return GameTime;
});