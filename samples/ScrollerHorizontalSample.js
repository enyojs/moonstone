enyo.kind({
	name: 'moon.sample.ScrollerHorizontalSample',
	classes: "moon",
	fit: false,
	components:[
		{kind: 'enyo.Spotlight'},
		{kind: "moon.Button", content: "A button"},
		{name: 'scroller', kind: 'moon.Scroller', vertical:"hidden", spotlight: "container", touch: true, classes: 'moon-scroller-sample-horizontal',
			components: [
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 1"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 2"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 4"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 6"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 7"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 8"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 9"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 10"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 11"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 12"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 13"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 14"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 15"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 16"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item", content: "This is an item 17"}
			]
		},
		{kind: "moon.Button", content: "A button"}
	]
});
