enyo.kind({
	name: 'moon.sample.ScrollerSample',
	classes: "moon moon-scroller-sample",
	fit: false,
	components:[
		{kind: 'enyo.Spotlight'},
		{kind: "moon.Button", content: "A button"},
		{name: 'scroller', kind: 'moon.Scroller', touch: true, classes: 'moon-scroller-sample-scroller',
			components: [
			{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
				{content: "English"},
				{content: "Spanish"},
				{content: "French"},
				{content: "German"},
				{content: "Italian"},
				{content: "Japanese"}
			]},
				{kind: "moon.Item", content: "This is an item 1"},
				{kind: "moon.Item", content: "This is an item 2"},
				{kind: "moon.Item", content: "This is an item 3", style: "background-color:red;width:1000px;"},
				{kind: "moon.Item", content: "This is an item 4"},
				{kind: "moon.Item", content: "This is an item 5"},
				{kind: "moon.Item", content: "This is an item 6"},
				{kind: "moon.Item", content: "This is an item 7"},
				{kind: "moon.Item", content: "This is an item 8"},
				{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
					{content: "English"},
					{content: "Spanish"},
					{content: "French"},
					{content: "German"},
					{content: "Italian"},
					{content: "Japanese"},
					{content: "Spanish"},
					{content: "French"},
					{content: "German"},
					{content: "Italian"},
					{content: "Japanese"}
				]},
				{kind: "moon.Item", content: "This is an item 9"},
				{kind: "moon.Item", content: "This is an item 10"},
				{kind: "moon.Item", content: "This is an item 11"},
				{kind: "moon.Item", content: "This is an item 12"},
				{kind: "moon.Button", content: "Test Button"},
				{kind: "moon.Item", content: "This is an item 13"},
				{kind: "moon.Item", content: "This is an item 14"},
				{kind: "moon.ExpandableListItem", content: "This is an expandable list item", components: [
					{content: "Item One"},
					{content: "Item Two"},
					{content: "Item Three"}
				]},
				{kind: "moon.Item", content: "This is an item 15"},
				{kind: "moon.Item", content: "This is an item 16"},
				{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.LabeledToggle", classes: "moon-expandable-picker-wrapper", components: [
					{content: "English"},
					{content: "Spanish"},
					{content: "French"},
					{content: "German"},
					{content: "Italian"},
					{content: "Japanese"},
					{content: "Spanish"},
					{content: "French"},
					{content: "German"},
					{content: "Italian"},
					{content: "Japanese"}
				]}
			]
		},
		{kind: "moon.Button", content: "A button"}
	]
});
