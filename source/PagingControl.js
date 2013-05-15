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
	//* Sets this control's CSS class based on its _side_ value.
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
	//* Bubbles a _paginate_ event when button is tapped.
	tap: function() {
		this.doPaginate({side: this.getSide()});
	},
	//* Overrides default focused handling to make sure scroller doesn't scroll to
	//* this button.
	noop: function() { return true; }
});