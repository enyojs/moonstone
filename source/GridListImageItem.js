/**
	_moon.GridListImageItem_ extends
	<a href="#enyo.GridListImageItem">enyo.GridListImageItem</a>, adding
	Moonstone-specific configuration, styling, decorators, and Spotlight/focus-state
	management.

	You may create an image grid by adding instances of this kind as components of
	a <a href="#moon.GridList">moon.GridList</a>.  See the latter kind for an
	example of how this may be done.
*/

enyo.kind({
    name: "moon.GridListImageItem",
    kind: "enyo.GridListImageItem",
	spotlight: true,
    classes: "moon-gridlist-item moon-gridlist-imageitem",
	handlers: {
		onSpotlightFocus: "focused"
	},
	focused: function (inSender, inEvent) {
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView");
		}
	}
});