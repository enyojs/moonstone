enyo.kind({
	name: "moon.sample.Scroller2dSample",
	classes: "moon enyo-unselectable enyo-fit",
	components:[
		{
			kind: 'moon.Scroller',
			classes: 'moon-scroller-sample-2d-scroller enyo-fill',
			components: [
				{style: "width: 2300px; height: 1300px;", components: [
					{kind: "moon.Button", content: "Button 1"},
					{kind: "moon.Button", content: "Button 2"},
					{kind: "moon.Button", content: "Button 3"},
					{kind: "moon.Button", content: "Button 4"},
					{kind: "moon.Button", content: "Button 5"},
					{kind: "moon.Button", content: "Button 6"},
					{kind: "moon.Button", content: "Button 7"},
					{kind: "moon.Button", content: "Button 8"},
					{kind: "moon.Button", content: "Button 9"},
					{kind: "moon.Button", content: "Button 10"},
					{kind: "moon.Button", content: "Button 11"},
					{kind: "moon.Button", content: "Button 12"}
				]}
			]
		}
	]
});
