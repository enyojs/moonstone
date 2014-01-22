/**
	_moon.ToggleText_, which extends [moon.Checkbox](#moon.Checkbox), is a control
	that looks like a switch with icons for an "on" state and an "off" state.
	When the ToggleText is tapped, it switches its state and fires an _onChange_
	event.
*/

enyo.kind({
	name: "moon.ToggleText",
	kind: "moon.Checkbox",
	//* @protected
	classes: "moon-toggle-indicator",
	create: function() {
		this.inherited(arguments);
		this.checkedChanged();
	},
	checkedChanged: function() {
		this.inherited(arguments);
		this.addRemoveClass("moon-toggle-item-on", this.checked);
		this.addRemoveClass("moon-toggle-item-off", !this.checked);		
	}
});
