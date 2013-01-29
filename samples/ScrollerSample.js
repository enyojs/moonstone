enyo.kind({
	name: 'moon.sample.ScrollerSample',
	classes: "moon moon-scroller-sample enyo-unselectable",
	fit: false,
	components:[
		{kind: 'enyo.Spotlight'},
		{kind: "moon.Button", content: "A button"},
		{classes: 'moon-scroller-sample-wrapper', components: [
			{name: 'scroller', kind: 'moon.Scroller', classes: 'moon-scroller-sample-scroller',
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
					{kind: "moon.Item", content: "This is an item 3"},
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
			{name: 'scroller2', kind: 'moon.Scroller', classes: 'moon-scroller-sample-scroller moon-scroller-sample-2d-scroller',
				components: [
					{kind: "moon.Button", content: "Test Button 1", style: "top:100px; left:100px;"},
					{kind: "moon.Button", content: "Test Button 2", style: "top:100px; left:700px;"},
					{kind: "moon.Button", content: "Test Button 3", style: "top:100px; left:1400px;"},
					{kind: "moon.Button", content: "Test Button 4", style: "top:500px; left:100px;"},
					{kind: "moon.Button", content: "Test Button 2", style: "top:500px; left:700px;"},
					{kind: "moon.Button", content: "Test Button 3", style: "top:500px; left:1400px;"},
					{kind: "moon.Button", content: "Test Button 4", style: "top:1000px; left:100px;"},
					{kind: "moon.Button", content: "Test Button 2", style: "top:1000px; left:700px;"},
					{kind: "moon.Button", content: "Test Button 3", style: "top:1000px; left:1400px;"}
				]
			},
		]},
		{kind: "moon.Button", content: "A button"}
	]
});
