enyo.kind({
	name: "moon.sample.ExpandablePickerSample",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{components: [
			{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: false, content: "Menu Langauge", defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
				{content: "English"},
				{content: "Spanish"},
				{content: "French"},
				{content: "German"},
				{content: "Italian"},
				{content: "Japanese"}
			]},
			{kind: "moon.ExpandablePicker", content: "Key Lock", classes: "moon-expandable-picker-wrapper", components: [
				{content: "On", active: true},
				{content: "Off"}
			]},
			{kind: "moon.ExpandablePicker", content: "ISM Method", classes: "moon-expandable-picker-wrapper", components: [
				{content: "Normal"},
				{content: "Orbiter", active: true}
			]},
			{kind: "moon.ExpandableListItem", content: "This is an expandable list item", components: [
				{content: "Item One"},
				{content: "Item Two"}
			]},
			{kind: "moon.ExpandableListItem", content: "This is another expandable list item", components: [
				{content: "Item Three"},
				{content: "Item Four"}
			]}
		]}
	]
});
