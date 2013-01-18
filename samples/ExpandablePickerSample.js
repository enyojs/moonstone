enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	style: "margin:20px;",
	classes: "moon",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{components: [
			{kind: "moon.ExpandablePicker", noneText: "No Language Selected", content: "Menu Langauge", defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
				{content: "English"},
				{content: "Spanish"},
				{content: "French"},
				{content: "German"},
				{content: "Italian"},
				{content: "Japanese"}
			]},
			{kind: "moon.ExpandablePicker", content: "Key Lock", classes: "moon-expandable-picker-wrapper", components: [
				{content: "On", active: true},
				{content: "Off"},
			]},
			{kind: "moon.ExpandablePicker", content: "ISM Method", classes: "moon-expandable-picker-wrapper", components: [
				{content: "Normal"},
				{content: "Orbiter"},
			]}
		]}
	]
});