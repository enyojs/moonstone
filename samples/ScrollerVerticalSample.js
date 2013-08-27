enyo.kind({
	name: 'moon.sample.ScrollerVerticalSample',
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'enyo.Spotlight'},
		{
			kind: 'moon.Scroller',
			classes: 'moon-scroller-vertical-sample-scroller enyo-fill',
			components: [
				{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.ToggleItem", classes: "moon-expandable-picker-wrapper", components: [
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
				{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.ToggleItem", classes: "moon-expandable-picker-wrapper", components: [
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
				{kind: "moon.Button", content: "Test Button", style: "margin-bottom: 28px;"},
				{kind: "moon.Item", content: "This is an item 13"},
				{kind: "moon.Item", content: "This is an item 14"},
				{kind: "moon.ExpandableListItem", content: "This is an expandable list item", components: [
					{content: "Item One"},
					{content: "Item Two"},
					{content: "Item Three"}
				]},
				{kind: "moon.Item", content: "This is an item 15"},
				{kind: "moon.Item", content: "This is an item 16"},
				{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Menu Langauge", defaultKind: "moon.ToggleItem", classes: "moon-expandable-picker-wrapper", components: [
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
		}
	]
});
