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
		side: null,
		holdPulseDelay: 40
	},
	handlers: {
		onSpotlightFocused: "noop",
		ontap: "tap",
		ondown: "beginHold",
		onup: "cancelHold",
		onleave: "cancelHold"
	},
	events: {
		onPaginate: "",
		onPageHold: "",
		onPageHoldPulse: "",
		onPageRelease: ""
	},
	create: function() {
		this.inherited(arguments);
		this.sideChanged();
	},
	//* Sets this control's CSS class based on its _side_ value.
	sideChanged: function() {
		var s = this.getSide();
		this.addRemoveClass("top",    (s === "top"));
		this.addRemoveClass("right",  (s === "right"));
		this.addRemoveClass("bottom", (s === "bottom"));
		this.addRemoveClass("left",   (s === "left"));
	},
	//* Bubbles a _paginate_ event when button is tapped.
	tap: function() {
		if (this.hasClass("hidden")) {
			return true;
		}
		this.doPaginate({side: this.getSide()});
	},
	//* Overrides default focused handling to make sure scroller doesn't scroll to
	//* this button.
	noop: function() { return true; },
	/**
		Handle auto page scrolling on hold events. Main reason we don't use the existing mouse hold
		implementation in drag.js is that holdPulseDelay is global and we need a custom rate here.
	**/
	beginHold: function(e) {
		if (this.hasClass("hidden")) {
			return true;
		}
		this.holdStart = enyo.now();
		this.holdJob = setInterval(this.bindSafely("sendHoldPulse", e), this.holdPulseDelay);
	},
	cancelHold: function() {
		clearInterval(this.holdJob);
		this.holdJob = null;
		if (this.sentHold) {
			this.sentHold = false;
			this.sendRelease();
		}
	},
	sendHoldPulse: function() {
		if (!this.sentHold) {
			this.sentHold = true;
			this.sendHold();
		}
		this.doPageHoldPulse({type:"pageholdpulse", preventDefault:enyo.gesture.preventDefault});
	},
	sendHold: function() {
		this.doPageHold({type:"pagehold"});
	},
	sendRelease: function() {
		this.doPageRelease({type:"pagerelease", preventDefault:enyo.gesture.preventDefault});
	}
});