/**
	_moon.GridListImageItem_ extends
	[enyo.GridListImageItem](#enyo.GridListImageItem), adding Moonstone-specific
	configuration, styling, decorators, and Spotlight/focus-state management.

	You may create an image grid by adding instances of this kind as components of
	a [moon.DataGridList](#moon.DataGridList). See the latter kind for an example of how
	this may be done.
*/

enyo.kind({
	name: "moon.GridListImageItem",
	kind: "enyo.GridListImageItem",
	//* @protected
	mixins: ["moon.MarqueeSupport"],
	spotlight: true,
	centered: true,
    classes: "moon-gridlist-item moon-gridlist-imageitem",
	componentOverrides: {
		caption: { kind:"moon.MarqueeText" },
		subCaption: { kind:"moon.MarqueeText" }
	},
	handlers: {
		onSpotlightFocus: "focused"
	},
	focused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
	}
});