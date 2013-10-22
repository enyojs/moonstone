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
	events: {
		onBeginHold: "",
		onEndHold: "",
		onPaginate: ""
	},
	handlers: {
		// TODO - spotlight events
		onSpotlightSelect: "depress",
		onSpotlightKeyUp: "undepress",
		ondown: "startHold",
		onup: "endHold",
		onleave: "endHold",
		onhold: "hold",
		onSpotlightFocused: "noop",
		onholdpulse: "noop",
		onActivate: "noop"
	},

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
	
	hitBoundary: function() {
		this.stopHoldJob();
		this.downTime = null;
		this.doPaginate({scrollDelta: this.delta * this.bumpDeltaMultiplier});
	},
	
	//* @protected
	
	//* Set this control's CSS class based on its _side_ value.
	sideChanged: function() {
		var s = this.getSide();
		this.addRemoveClass("top",    (s === "top"));
		this.addRemoveClass("right",  (s === "right"));
		this.addRemoveClass("bottom", (s === "bottom"));
		this.addRemoveClass("left",   (s === "left"));
	},
	startHold: function() {
		if (!this.processEvents()) {
			return;
		}
		
		this.holding = false;
		return true;
	},
	hold: function(inSender, inEvent) {
		if (!this.processEvents()) {
			return;
		}
		
		if (this.holding) {
			return true;
		}
		
		this.holding = true;
		this.doBeginHold({side: this.getSide()});
		return false;
	},
	endHold: function(inSender, inEvent) {
		if (!this.processEvents()) {
			return;
		}
		
		if (this.holding === null) {
			return false;
		}
		else if (this.holding === true) {
			this.doEndHold({side: this.getSide()});
		}
		else if (this.holding === false) {
			this.doPaginate({side: this.getSide()});
		}
		
		this.holding = null;
		return true;
	},
	processEvents: function() {
		return !this.hasClass("hidden");
	},
	
	
	depress: function(inSender, inEvent) {
		this.inherited(arguments);
		// keydown events repeat (while mousedown/hold does not); simulate
		// hold behavior with mouse by catching the second keydown event
		if (!this.downCount) {
			this.down();
			this.downCount = 1;
		} else {
			this.downCount++;
		}
		if (this.downCount == 2) {
			this.hold();
		}
	},
	undepress: function(inSender, inEvent) {
		this.inherited(arguments);
		this.downCount = 0;
		this.endHold(inSender, inEvent);
	},
	//* Override default focused handling to make sure scroller doesn't scroll to this button.
	noop: function() { return true; }
});