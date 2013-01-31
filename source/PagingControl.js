/**
	Paging control button kind
**/
enyo.kind({
	name: "moon.PagingControl",
	kind: "moon.IconButton",
	classes: "moon-paging-button",
	spotlight: true,
	published: {
		side: null
	},
	handlers: {
		onSpotlightFocused: "noop",
		ontap: "tap"
	},
	events: {
		onPaginate: ""
	},
	create: function() {
		this.inherited(arguments);
		this.sideChanged();
	},
	//* Set this control's css class based on side
	sideChanged: function() {
		var s = this.getSide();
		if (s === "top") {
			this.addClass("top");
		} else {
			this.removeClass("top");
		}
		if (s === "right") {
			this.addClass("right");
		} else {
			this.removeClass("right");
		}
		if (s === "bottom") {
			this.addClass("bottom");
		} else {
			this.removeClass("bottom");
		}
		if (s === "left") {
			this.addClass("left");
		} else {
			this.removeClass("left");
		}
	},
	//* When button is tapped, bubble a paginate event
	tap: function() {
		this.doPaginate({side: this.getSide()});
	},
	//* Override default focused handling to make sure scroller doesn't scroll to this button
	noop: function() { return true; }
});