/**
	_moon.Tooltip_ is a kind of <a href="#moon.Popup">moon.Popup</a> that works
	with an	<a href="#moon.TooltipDecorator">moon.TooltipDecorator</a>. It
	automatically displays a tooltip when the user hovers over the decorator.
	The tooltip is positioned around the decorator where there is available
	window space.

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.Button", content: "Tooltip"},
			{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
		]}

	You may manually display the tooltip by calling its _show_ method.
*/

enyo.kind({
	name: "moon.Tooltip",
	kind: "enyo.Popup",
	classes: "moon-tooltip below left-arrow",
	//* If true, tooltip is automatically dismissed when user stops hovering
	//* over the decorator
	autoDismiss: false,
	//* Hovering over the decorator for this length of time (in milliseconds)
	//* causes the tooltip to appear.
	showDelay: 500,
	//* Default margin-left value
	defaultLeft: 10,
	//* @protected
	handlers: {
		onRequestShowTooltip: "requestShow",
		onRequestHideTooltip: "requestHide"
	},
	tools: [
		{name: "client", classes: "moon-tooltip-label moon-header-font"}
	],
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	},
	create: function() {
		this.inherited(arguments);
		this.contentChanged();
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	},
	requestShow: function() {
		this.showJob = setTimeout(this.bindSafely("show"), this.showDelay);
		return true;
	},
	cancelShow: function() {
		clearTimeout(this.showJob);
	},
	requestHide: function() {
		this.cancelShow();
		return this.inherited(arguments);
	},
	showingChanged: function() {
		this.cancelShow();
		this.adjustPosition(true);
		this.inherited(arguments);
	},
	applyPosition: function(inRect) {
		var s = "";
		for (var n in inRect) {
			s += (n + ":" + inRect[n] + (isNaN(inRect[n]) ? "; " : "px; "));
		}
		this.addStyles(s);
	},
	adjustPosition: function(belowActivator) {
		if (this.showing && this.hasNode()) {
			var b = this.node.getBoundingClientRect();
			
			//when the tooltip bottom goes below the window height move it above the decorator
			if (b.top + b.height > window.innerHeight) {
				this.addRemoveClass("below", false);
				this.addRemoveClass("above", true);
				this.applyStyle("top", -b.height + "px");
			} else {
				this.addRemoveClass("above", false);
				this.addRemoveClass("below", true);
				this.applyStyle("top", "100%");
			}
			
			// FIXME: Leaving the following commented until verification from UX
			//when the tooltip top goes above the window height move it below the decorator
			/*
			if (b.top < 0) {
				this.addRemoveClass("below", true);
				this.addRemoveClass("above", false);
			} else {
				this.addRemoveClass("above", true);
				this.addRemoveClass("below", false);
			}
			*/

			//when the tooltip's right edge is out of the window, align its right edge with the decorator left edge (approx)
			if (b.left + b.width > window.innerWidth){
				//use the right-arrow
				this.applyPosition({'margin-left': -b.width});
				this.addRemoveClass("left-arrow", false);
				this.addRemoveClass("right-arrow", true);
				this.$.client.addRemoveClass("right-arrow", true);
			}
		}
	},
	resizeHandler: function() {
		//reset the tooltip to align its left edge with the decorator
		this.applyPosition({"margin-left": this.defaultLeft, "bottom": "auto"});
		this.addRemoveClass("left-arrow", true);
		this.addRemoveClass("right-arrow", false);
		this.applyStyle("top", "100%");
		this.$.client.addRemoveClass("right-arrow", false);
		this.adjustPosition(true);
		this.inherited(arguments);
	}
});
