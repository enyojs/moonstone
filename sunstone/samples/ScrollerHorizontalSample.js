enyo.kind({
	name: 'sun.sample.ScrollerHorizontalSample',
	classes: "sun moon enyo-unselectable enyo-fit",
	components:[
		{kind: 'enyo.Spotlight'},
		{classes: "sun-scroller-sample-horizontal-wrapper", components: [
			{kind: "moon.Divider", content: "Item Spotlight (default-style)", classes: "sun-scroller-sample-divider"},
			{kind: 'sun.Scroller', vertical: "hidden", spotlight: "container", name: "scroller1",			
				classes: 'sun-scroller-sample-horizontal',
				components: [
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3"}
				]
			},
			{kind: "moon.SimplePicker", name: "picker1", onChange: "spotlightChanged", components: [
				{content: "left"},
				{content: "bottom"},
				{content: "top"},
				{content: "right"},
				{content: "none"}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Item Spotlight (overlay-style)", classes: "sun-scroller-sample-divider"},
			{kind: 'sun.Scroller', vertical: "hidden", spotlight: "container", name: "scroller2",
				classes: 'sun-scroller-sample-horizontal',
				components: [
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "right"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "right"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "right"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "right"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "right"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "left"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item enyo", spotlightOverlay: true, spotlightPosition: "bottom"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item html5", spotlightOverlay: true, spotlightPosition: "top"},
					{kind: "moon.Item", classes: "sun-scroller-sample-item css3", spotlightOverlay: true, spotlightPosition: "right"}
				]
			}
		]}
	],	
	spotlightChanged: function(inSender, inEvent) {
		var c = this.$.scroller1.controls;
		var len = c.length;
		for (var i=0; i<len; i++) {
			if (c[i].kind === "moon.Item") {
				c[i].setSpotlightPosition(inEvent.content);
			}
		}
	}
});
