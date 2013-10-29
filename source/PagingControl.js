/**
	_moon.PagingControl_ is a paging control button derived from
	<a href="#moon.IconButton">moon.IconButton</a>.
**/
enyo.kind({
	name: "moon.PagingControl",
	kind: "moon.IconButton",
	published: {
		icon: "arrowlargeup",
		side: null
	},
	events: {
		onBeginHold: "",
		onEndHold: "",
		onPaginate: ""
	},
	//* @protected
	handlers: {
		onSpotlightSelect: "startHold",
		onSpotlightKeyUp: "endHold",
		ondown: "startHold",
		onup: "endHold",
		onleave: "endHold",
		onhold: "hold",
		onSpotlightFocused: "noop",
		onholdpulse: "noop",
		onActivate: "noop"
	},
	classes: "moon-paging-button",
	spotlight: true,
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
	noop: function() { return true; }
});