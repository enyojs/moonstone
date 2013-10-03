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
	},
	disabledChanged: function(inOld) {
		this.addRemoveClass("disabled", this.disabled);
	},
	spotlightFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView", {side: "top"});
		}
	},
	contentChanged: function(inOld) {
		if (this.$.marqueeText) {
			this.$.marqueeText.setContent(this.content);
		} else {
			this.inherited(arguments);
		}
	}
});
