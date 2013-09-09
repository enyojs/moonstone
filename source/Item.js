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
		disabled: false
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
		if (!this.components) {
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
