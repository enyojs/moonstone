/**
	_moon.PagingControl_ is a paging control button derived from
	<a href="#moon.IconButton">moon.IconButton</a>.
**/
enyo.kind({
	name: "moon.PagingControl",
	kind: "moon.IconButton",
	classes: "moon-paging-button",
	spotlight: true,
	published: {
		side: null
	},
	downTime: 0,
	initialDelta: 1,
	delta: 0,
	handlers: {
		onSpotlightFocused: "noop",
		ontap: "tap",
		ondown: "down",
		onup: "endHold",
		onleave: "endHold",
		onhold: "hold"
	},
	events: {
		onPaginate: "",
		onPaginateScroll: ""
	},
	create: function() {
		this.inherited(arguments);
		this.sideChanged();
	},
	//* Set this control's CSS class based on its _side_ value.
	sideChanged: function() {
		var s = this.getSide();
		this.addRemoveClass("top",    (s === "top"));
		this.addRemoveClass("right",  (s === "right"));
		this.addRemoveClass("bottom", (s === "bottom"));
		this.addRemoveClass("left",   (s === "left"));
	},
	down: function(inSender, inEvent) {
		if (this.hasClass("hidden")) {
			return;
		}
		
		this.downTime = enyo.now();
		this.delta = this.initialDelta;
	},
	hold: function(inSender, inEvent) {
		if (this.hasClass("hidden")) {
			return;
		}

		this.startHoldJob();
	},
	endHold: function(inSender, inEvent) {
		if (!this.downTime) {
			return;
		}
		
		this.stopHoldJob();
		this.sendPaginateEvent();
		this.downTime = null;
	},
	startHoldJob: function() {
		this.stopHoldJob();
		
		var t0 = enyo.now(),
			t = 0
		;
		
		var fn = this.bindSafely(function() {
			this.job = enyo.requestAnimationFrame(fn);
			
			t = (enyo.now() - t0)/1000;
			this.delta = this.delta + (0.1 * Math.pow(t, 1.1));
			
			this.doPaginateScroll({scrollDelta: this.delta});
		});
		
		this.job = enyo.requestAnimationFrame(fn);
	},
	stopHoldJob: function() {
		this.job = enyo.cancelRequestAnimationFrame(this.job);
	},
	sendPaginateEvent: function() {
		var tapThreshold = 200,
			timeElapsed = enyo.now() - this.downTime,
			delta = this.delta * 15
		;
		
		if (timeElapsed <= tapThreshold) {
			delta *= 5;
		}
		
		this.doPaginate({scrollDelta: delta});
	},
	//* Override default focused handling to make sure scroller doesn't scroll to this button.
	noop: function() { return true; }
});