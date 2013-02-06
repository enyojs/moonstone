enyo.kind({
	name: "moon.LabeledToggleButton",
	kind: "moon.LabeledCheckbox",
	//* @protected
	classes: "moon-labeled-toggle-button",
	components: [
		{classes: "moon-labeled-checkbox-label-wrapper", components: [
			{name: "label", classes: "moon-labeled-checkbox-label"},
		]},
		{name: "input", kind: "moon.ToggleButton", spotlight: false}
	]
});