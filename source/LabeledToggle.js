enyo.kind({
	name: "moon.LabeledToggle",
	kind: "moon.LabeledCheckbox",
	//* @protected
	components: [
		{name: "label", classes: "moon-labeled-checkbox-label"},
		{kind: "moon.Toggle"}
	]
});