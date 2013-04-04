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