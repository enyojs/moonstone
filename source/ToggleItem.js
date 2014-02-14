/**
	_moon.ToggleItem_ is a control that combines a
	[moon.ToggleText](#moon.ToggleText) with a text label.
*/
enyo.kind({
	name: "moon.ToggleItem",
	kind: "moon.CheckboxItem",
	published: {
		//* Text label for the "on" state
		onContent: moon.$L("on"),   // i18n "ON" label in moon.ToggleText / moon.ToggleItem widget
		//* Text label for the "off" state
		offContent: moon.$L("off")  // i18n "OFF" label in moon.ToggleText / moon.ToggleItem widget
	},
	//* @protected
	classes: "moon-toggle-item",
	checkboxOnRight: true,
	components: [
		{classes: "moon-toggle-item-fit", components: [
			{classes: "moon-toggle-item-wrapper", components: [
				{name: "client", mixins: ["moon.MarqueeItem"], classes: "moon-checkbox-item-label-wrapper moon-toggle-item-label-wrapper"}
			]}
		]},
		{name: "input", kind: "moon.ToggleText", spotlight: false}
	],
	bindings: [
		{from: ".onContent", to: ".$.input.onContent"},
		{from: ".offContent", to: ".$.input.offContent"}
	],
	decorateActivateEvent: function() {
		this.inherited(arguments);
		this.resetMarquee();
	}
});