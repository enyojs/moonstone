enyo.kind({
	name: "moon.sample.CheckboxSample",
	fit: true,
	classes: "moon",
	components: [
		{kind: "enyo.Spotlight"},
		{components: [
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Checkboxes"},
				{kind: "moon.LabeledCheckbox", content: "Item 1"},
				{kind: "moon.LabeledCheckbox", content: "Item 2"},
				{kind: "moon.LabeledCheckbox", content: "Item 3"},
				{kind: "moon.LabeledCheckbox", content: "Item 4"},
				{kind: "moon.LabeledCheckbox", content: "Item 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Checkbox Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledCheckbox", content: "Item 1"},
					{kind: "moon.LabeledCheckbox", content: "Item 2"},
					{kind: "moon.LabeledCheckbox", content: "Item 3"},
					{kind: "moon.LabeledCheckbox", content: "Item 4"},
					{kind: "moon.LabeledCheckbox", content: "Item 5"}
				]}
			]}
		]},
		{components: [
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Toggles"},
				{kind: "moon.LabeledToggle", content: "Item 1"},
				{kind: "moon.LabeledToggle", content: "Item 2"},
				{kind: "moon.LabeledToggle", content: "Item 3"},
				{kind: "moon.LabeledToggle", content: "Item 4"},
				{kind: "moon.LabeledToggle", content: "Item 5"}
			]},
			{classes: "checkbox-sample-wrapper", components: [
				{classes: "checkbox-sample-wrapper-title", content: "Toggle Group"},
				{kind: "Group", components: [
					{kind: "moon.LabeledToggle", content: "Item 1"},
					{kind: "moon.LabeledToggle", content: "Item 2"},
					{kind: "moon.LabeledToggle", content: "Item 3"},
					{kind: "moon.LabeledToggle", content: "Item 4"},
					{kind: "moon.LabeledToggle", content: "Item 5"}
				]}
			]}
		]}
	]
});