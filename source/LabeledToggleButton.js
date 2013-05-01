/**
	_moon.LabeledToggleButton_ is a control that combines a
	<a href="#moon.ToggleButton">moon.ToggleButton</a> with a text label.
*/
enyo.kind({
	name: "moon.LabeledToggleButton",
	kind: "moon.LabeledCheckbox",
	//* @protected
	classes: "moon-labeled-toggle-button",
	components: [
		{classes: "moon-labeled-toggle-button-label-wrapper", components: [
			{name: "label", classes: "moon-labeled-toggle-button-label"}
		]},
		{name: "input", kind: "moon.ToggleButton", spotlight: false}
	]
});