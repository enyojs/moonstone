enyo.kind({
	name: 'moon.sample.ScrollerHorizontalSample',
	classes: "moon enyo-unselectable",
	components:[
		{kind: 'enyo.Spotlight'},
		{name: 'scroller', kind: 'moon.Scroller', vertical:"hidden", spotlight: "container", classes: 'moon-scroller-sample-horizontal',
			components: [
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item enyo"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item html5"},
				{kind: "moon.Item", classes:"moon-scroller-sample-item css3"}
			]
		}
	]
});
