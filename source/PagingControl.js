/**
	_moon.PagingControl_ is a paging control button derived from
	[moon.IconButton](#moon.IconButton). This control is not intended for use
	outside of [moon.Scroller](#moon.Scroller).
*/
enyo.kind({
	name: "moon.PagingControl",
	kind: "moon.IconButton",
	//* @protected
	classes: "moon-paging-button no-background",
	spotlight: true,
	//* @public
	published: {
		side: null
	},
	//* @protected
	noBackground: true,
	handlers: {
		onSpotlightFocused: "noop",
		onSpotlightKeyDown: "depress",
		onSpotlightKeyUp: "undepress",
		ondown: "down",
		onup: "endHold",
		onleave: "endHold",
		onhold: "hold",
		onActivate: "noop"
	},
	//* @public
	events: {
		//* Fires when page boundary is reached.
		onPaginate: "",
		/**
			Fires when we've determined how large the bounceback effect should be.

			_inEvent.scrollDelta_ contains a number representing the magnitude of the
			bounceback effect.
		*/
		onPaginateScroll: ""
	},
	//* @protected
	downTime: 0,
	initialDelta: 2.5,
	delta: 0,
	maxDelta: 100,
	tapDelta: 15,
	bumpDeltaMultiplier: 3,
	
	create: function() {
		this.inherited(arguments);
		this.sideChanged();
	},
	
	//* @public
	/**
		Stops scrolling animation and triggers _onPaginate_ event with a delta value
		for the bounceback effect.
	*/
	hitBoundary: function() {
		this.stopHoldJob();
		this.downTime = null;
		this.doPaginate({scrollDelta: this.delta * this.bumpDeltaMultiplier});
		enyo.Spotlight.Accelerator.cancel();
	},
	
	//* @protected
	
	_iconMappings: {
		"top": "arrowlargeup",
		"bottom": "arrowlargedown",
		"left": "arrowlargeleft",
		"right": "arrowlargeright"
	},
	//* Set this control's CSS class based on its _side_ value.
	sideChanged: function(inOld) {
		var s = this.getSide();
		this.removeClass(inOld);
		this.addClass(s);
		this.setIcon(this._iconMappings[s]);
	},
	down: function(inSender, inEvent) {
		if (this.disabled) {
			return;
		}
		
		this.downTime = enyo.bench();
		this.delta = this.initialDelta;
	},
	hold: function(inSender, inEvent) {
		if (this.disabled) {
			return;
		}

		this.startHoldJob();
	},
	depress: function(inSender, inEvent) {
		this.inherited(arguments);
		// keydown events repeat (while mousedown/hold does not); simulate
		// hold behavior with mouse by catching the second keydown event
		if (inEvent.keyCode == 13) {
			if (!this.downCount) {
				this.down();
				this.downCount = 1;
			} else {
				this.downCount++;
			}
			if (this.downCount == 2) {
				this.hold();
			}
		}
	},
	undepress: function(inSender, inEvent) {
		this.inherited(arguments);
		this.downCount = 0;
		this.endHold(inSender, inEvent);
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
		
		var t0 = enyo.bench(),
			t = 0
		;
		
		var fn = this.bindSafely(function() {
			this.job = enyo.requestAnimationFrame(fn);
			
			t = (enyo.bench() - t0)/1000;
			this.delta = Math.min(this.maxDelta, this.delta + (0.1 * Math.pow(t, 1.1)));
			
			this.doPaginateScroll({scrollDelta: this.delta});
		});
		
		this.job = enyo.requestAnimationFrame(fn);
	},
	stopHoldJob: function() {
		this.job = enyo.cancelRequestAnimationFrame(this.job);
	},
	sendPaginateEvent: function() {
		var tapThreshold = 200,
			timeElapsed = enyo.bench() - this.downTime,
			delta = (timeElapsed <= tapThreshold) ? this.tapDelta : this.delta;
		
		this.doPaginate({scrollDelta: delta});
	},
	//* Override default focused handling to make sure scroller doesn't scroll to this button.
	noop: function() { return true; }
});