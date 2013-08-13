/**
	_moon.Item_ is a focusable Moonstone-styled control that can display simple
	text.
*/
enyo.kind({
	name: "moon.Item",
	classes: "moon-item",
	mixins: ["moon.MarqueeSupport"],
	spotlight: true,
	handlers: {
		onSpotlightFocused: "spotlightFocused"
	},
	published: {
		//* When true, button is shown as disabled and does not generate tap
		//* events
		disabled: false,
		//* The relative position of the spotlight;
		//* valid values are "locale-default", "left", "right", "top", and "bottom".
		//* The locale-specific setting selects either left or right, depending on the
		//* default text-direction of the current locale provided by _enyo-ilib_
		//* (defaults to left if _enyo-ilib_ is not loaded).
		spotlightPosition: "locale-default",
		//* The behavior of the spotlight
		spotlightOverlay: false,
		//* When true, create marquee text
		marquee: true
	},
	//* @protected
	overlayComponents: [
		{name: "overlay", classes: "moon-item-overlay", addBefore: true}
	],
	create: function() {
		this.inherited(arguments);
		this.disabledChanged();
	},
	initComponents: function() {
		this.inherited(arguments);
		if (this.marquee) {
			this.createComponent({name: "marqueeText", kind:"moon.MarqueeText"});
		}
		this.spotlightConfig();
	},
	rendered: function() {
		this.inherited(arguments);
		this.setSpotlightBounds();
	},
	spotlightConfig: function() {
		if (this.spotlightOverlay) {
			this.createComponents(this.overlayComponents);
			this.addClass("overlay");
		}
		this.addClass(this.spotlightPosition);
	},
	setSpotlightBounds: function() {
		if (this.spotlightOverlay) {
			var b = this.getBounds();
			var ob;
			switch (this.spotlightPosition) {
			case "top":
				ob = {width: b.width};
				break;
			case "bottom":
				ob = {width: b.width, bottom: 0};
				break;
			case "left":
				ob = {height: b.height};
				break;
			case "right":
				ob = {height: b.height, right: 0};
				break;
			}
			this.$.overlay.setBounds(ob);
		}
	},
	spotlightPositionChanged: function(inOld) {
		this.removeClass(inOld);
		this.addClass(this.spotlightPosition);
	},
	disabledChanged: function(inOld) {
		this.addRemoveClass("disabled", this.disabled);
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
		return true;
	},
	contentChanged: function(inOld) {
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
		} else {
			this.inherited(arguments);
		}
	}
});
