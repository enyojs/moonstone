/**
	_moon.ToggleItem_ is a control that combines a
	[moon.ToggleText](#moon.ToggleText) with a text label.
*/
enyo.kind({
	name: "moon.ToggleItem",
	kind: "moon.CheckboxItem",
	//* @protected
	classes: "moon-toggle-item",
	checkboxOnRight: true,
	componentOverrides: {
		client: {classes: "moon-toggle-item-label-wrapper"},
		input: {kind: "moon.ToggleSwitch", spotlight: false}
	}
});