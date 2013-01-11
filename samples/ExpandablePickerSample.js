enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	style: "margin:20px;",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{components: [
			{kind: "moon.ExpandablePicker", content: "Expandable Toggle Group Picker", open: false, highlander: true, defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
				{content: "One"},
				{content: "Two"},
				{content: "Three"},
				{content: "Four"},
				{content: "Five"},
				{content: "Six"}
			]},
			{kind: "moon.ExpandablePicker", content: "Expandable Checkbox Picker", open: false, highlander: false, defaultKind: "moon.LabeledCheckbox", classes: "moon-expandable-picker-wrapper", components: [
				{content: "One"},
				{content: "Two"},
				{content: "Three"},
				{content: "Four"},
				{content: "Five"},
				{content: "Six"}
			]},
			{kind: "moon.ExpandablePicker", content: "Expandable Checkbox Group Picker", open: false, highlander: true, defaultKind: "moon.LabeledCheckbox", classes: "moon-expandable-picker-wrapper", components: [
				{content: "One"},
				{content: "Two"},
				{content: "Three"},
				{content: "Four"},
				{content: "Five"},
				{content: "Six"}
			]}
		]}
	]
});