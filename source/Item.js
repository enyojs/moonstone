/**
	_moon.Item_ is a focusable Moonstone-styled control that can display simple
	text.
*/
enyo.kind({
	name: "moon.Item",
	classes: "moon-item",
	mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"],
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
	disabledChanged: function(inOld) {
		this.addRemoveClass("disabled", this.disabled);
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
	}
});
