enyo.kind({
	name: "moon.sample.CheckboxSample",
	fit: true,
	classes: "moon enyo-unselectable",
	components: [
		{kind: "enyo.Spotlight"},
		{components: [
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Labeled Checkboxes"},
				{kind: "moon.LabeledCheckbox", content: "Item 1"},
				{kind: "moon.LabeledCheckbox", content: "Item 2"},
				{kind: "moon.LabeledCheckbox", content: "Item 3"},
				{kind: "moon.LabeledCheckbox", disabled: true, content: "Disabled"},
				{kind: "moon.LabeledCheckbox", content: "Item 4"},
				{kind: "moon.LabeledCheckbox", content: "This is a verrry long item 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Labeled Checkbox Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledCheckbox", content: "Item 1"},
					{kind: "moon.LabeledCheckbox", content: "Item 2"},
					{kind: "moon.LabeledCheckbox", content: "Item 3"},
					{kind: "moon.LabeledCheckbox", disabled: true, content: "Disabled"},
					{kind: "moon.LabeledCheckbox", content: "Item 4"},
					{kind: "moon.LabeledCheckbox", content: "Item 5"}
				]}
			]}
		]},
		{components: [
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Labeled Toggle Buttons"},
				{kind: "moon.LabeledToggleButton", content: "Item 1"},
				{kind: "moon.LabeledToggleButton", content: "Item 2"},
				{kind: "moon.LabeledToggleButton", content: "Item 3"},
				{kind: "moon.LabeledToggleButton", disabled: true, content: "Disabled"},
				{kind: "moon.LabeledToggleButton", content: "Item 4"},
				{kind: "moon.LabeledToggleButton", content: "This is a verrry long item 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Labeled Toggle Button Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledToggleButton", content: "Item 1"},
					{kind: "moon.LabeledToggleButton", content: "Item 2"},
					{kind: "moon.LabeledToggleButton", content: "Item 3"},
					{kind: "moon.LabeledToggleButton", disabled: true, content: "Disabled"},
					{kind: "moon.LabeledToggleButton", content: "Item 4"},
					{kind: "moon.LabeledToggleButton", content: "Item 5"}
				]}
			]}
		]}
	]
});