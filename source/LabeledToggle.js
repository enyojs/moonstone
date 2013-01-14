enyo.kind({
	name: "moon.LabeledToggle",
	kind: "moon.LabeledCheckbox",
	//* @protected
	components: [
		{name: "label", classes: "moon-labeled-checkbox-label"},
		{name: "input", kind: "moon.Toggle", spotlight: false}
	]
});