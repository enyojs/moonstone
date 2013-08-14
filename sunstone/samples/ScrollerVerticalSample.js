enyo.kind({
	name: 'sun.sample.ScrollerVerticalSample',
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'enyo.Spotlight'},
		{kind: 'sun.Scroller', name: "scroller",  classes: 'sun-scroller-vertical-sample-scroller enyo-fill',
			components: [				
				{kind: "moon.Item", content: "This is an item 1"},
				{kind: "moon.Item", content: "This is an item 2"},
				{kind: "moon.Item", content: "This is an item 3"},
				{kind: "moon.Item", content: "This is an item 4"},
				{kind: "moon.Item", content: "This is an item 5"},
				{kind: "moon.Item", content: "This is an item 6"},
				{kind: "moon.Item", content: "This is an item 7"},
				{kind: "moon.Item", content: "This is an item 8"},				
				{kind: "moon.Item", content: "This is an item 9"},
				{kind: "moon.Item", content: "This is an item 10"},
				{kind: "moon.Item", content: "This is an item 11"},
				{kind: "moon.Item", content: "This is an item 12"},				
				{kind: "moon.Item", content: "This is an item 13"},
				{kind: "moon.Item", content: "This is an item 14"},				
				{kind: "moon.Item", content: "This is an item 15"},
				{kind: "moon.Item", content: "This is an item 16"},				
			]
		}
	],
	initComponents: function () {		
		this.inherited(arguments);
		var c = this.$.scroller.controls;
		var len = c.length;
		for (var i=0; i<len; i++) {
			if (c[i].kind === "moon.Item") {			
				c[i].setSpotlightPosition("none");
			}			
		}
	},	
});
