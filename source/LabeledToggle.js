enyo.kind({
	name: "moon.LabeledToggle",
	kind: "moon.LabeledCheckbox",
	//* @protected
	classes: "moon-labeled-toggle",
	components: [
		{classes: "moon-labeled-checkbox-label-wrapper", components: [
			{name: "label", classes: "moon-labeled-checkbox-label"},
		]},
		{name: "input", kind: "moon.Toggle", spotlight: false}
	]
});