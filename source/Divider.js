/**
	_moon.Divider_ is a simple styled component that may be used as a separator
	between groups of components.
*/
enyo.kind({
	name: "moon.Divider",
	classes: "moon-divider",
	mixins: ["moon.MarqueeSupport"],
	marqueeOnSpotlight: false,
	components: [
		{name: "marqueeText", kind:"moon.MarqueeText", clipInsidePadding: true}
	],
	rendered: function() {
		this.startMarquee();
	},
	contentChanged: function() {
		this.$.marqueeText.setContent(this.content);
	}
});