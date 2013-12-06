/**
	_moon.ToggleText_, which extends [moon.Checkbox](#moon.Checkbox), is a control
	that looks like a switch with labels for an "on" state and an "off" state.
	When the ToggleText is tapped, it switches its state and fires an _onChange_
	event.
*/

enyo.kind({
	name: "moon.ToggleText",
	kind: "moon.Checkbox",
	//* @public
	published: {
		//* Text label for the "on" state
		onContent: moon.$L("on"),   // i18n "ON" label in moon.ToggleText / moon.ToggleItem widget
		//* Text label for the "off" state
		offContent: moon.$L("off")  // i18n "OFF" label in moon.ToggleText / moon.ToggleItem widget
	},
	//* @protected
	classes: "moon-toggle-text",
	components: [
		{name: "label", classes: "moon-toggle-text-text"}
	],
	create: function() {
		this.inherited(arguments);
		this.checkedChanged();
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.$.label.setContent(this.getChecked() ? this.onContent : this.offContent);
	},
	shouldDoTransition: function(inChecked) {
		return true;
	},
	createOverlayComponent: function() {
		var content = this.getChecked() ? this.getOnContent() : this.getOffContent();
		return this.createComponent({name: "overlay", classes: "moon-overlay", content: content});
	}
});
