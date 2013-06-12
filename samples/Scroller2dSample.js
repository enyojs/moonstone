enyo.kind({
	name: "moon.sample.Scroller2dSample",
	classes: "moon enyo-unselectable enyo-fit",
	components:[
		{kind: 'enyo.Spotlight'},
		{kind: 'moon.Scroller', classes: 'moon-scroller-sample-2d-scroller enyo-fill',
			components: [
				{kind: "moon.Button", content: "Button 1", style: "top:100px; left:100px;"},
				{kind: "moon.Button", content: "Button 2", style: "top:100px; left:700px;"},
				{kind: "moon.Button", content: "Button 3", style: "top:100px; left:1400px;"},
				{kind: "moon.Button", content: "Button 4", style: "top:100px; left:2100px;"},
				{kind: "moon.Button", content: "Button 5", style: "top:600px; left:100px;"},
				{kind: "moon.Button", content: "Button 6", style: "top:600px; left:700px;"},
				{kind: "moon.Button", content: "Button 7", style: "top:600px; left:1400px;"},
				{kind: "moon.Button", content: "Button 8", style: "top:600px; left:2100px;"},
				{kind: "moon.Button", content: "Button 9", style: "top:1100px; left:100px;"},
				{kind: "moon.Button", content: "Button 10", style: "top:1100px; left:700px;"},
				{kind: "moon.Button", content: "Button 11", style: "top:1100px; left:1400px;"},
				{kind: "moon.Button", content: "Button 12", style: "top:1100px; left:2100px;"}
			]
		}
	]
});
