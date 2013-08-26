/**
	_moon.ToggleItem_ is a control that combines a
	<a href="#moon.ToggleText">moon.ToggleText</a> with a text label.
*/
enyo.kind({
	name: "moon.ToggleItem",
	kind: "moon.CheckboxItem",
	//* @protected
	classes: "moon-toggle-item",
	checkboxOnRight: true,
	components: [
		{classes: "moon-toggle-item-label-wrapper", name: "client"},
		{name: "input", kind: "moon.ToggleText", spotlight: false}
	]
});