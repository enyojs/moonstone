/**
	_moon.Divider_ is a simple styled component that may be used as a separator
	between groups of components.
*/
enyo.kind({
	name: "moon.Divider",
	//* @protected
	classes: "moon-divider moon-divider-text",
	mixins: ["moon.MarqueeSupport", "moon.MarqueeItem"],
	marqueeOnSpotlight: false,
	marqueeOnRender: true
});