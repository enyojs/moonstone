enyo.kind({
	name: "moon.sample.CheckboxSample",
	kind: "moon.Scroller",
	fit: true,
	classes: "moon enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{
			components: [
			{classes: "checkbox-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Labeled Checkboxes"},
				{kind: "moon.LabeledCheckbox", content: "Option 1", checked: true},
				{kind: "moon.LabeledCheckbox", content: "Option 2"},
				{kind: "moon.LabeledCheckbox", disabled: true, content: "Disabled"},
				{kind: "moon.LabeledCheckbox", content: "Option 4", checked: true},
				{kind: "moon.LabeledCheckbox", content: "This is a verrry long option 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Labeled Checkbox Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledCheckbox", content: "Option 1"},
					{kind: "moon.LabeledCheckbox", content: "Option 2", checked: true},
					{kind: "moon.LabeledCheckbox", disabled: true, content: "Disabled"},
					{kind: "moon.LabeledCheckbox", content: "Option 4"},
					{kind: "moon.LabeledCheckbox", content: "Option 5"}
				]}
			]}
		]},
		{components: [
			{classes: "checkbox-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Labeled Toggle Buttons"},
				{kind: "moon.LabeledToggleButton", content: "Option 1"},
				{kind: "moon.LabeledToggleButton", content: "Option 2"},
				{kind: "moon.LabeledToggleButton", disabled: true, content: "Disabled"},
				{kind: "moon.LabeledToggleButton", content: "Option 4"},
				{kind: "moon.LabeledToggleButton", content: "This is a verrry long option 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{kind: "moon.Divider", content: "Labeled Toggle Button Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledToggleButton", content: "Option 1"},
					{kind: "moon.LabeledToggleButton", content: "Option 2"},
					{kind: "moon.LabeledToggleButton", disabled: true, content: "Disabled"},
					{kind: "moon.LabeledToggleButton", content: "Option 4"},
					{kind: "moon.LabeledToggleButton", content: "Option 5"}
				]}
			]}
		]}
	]
});