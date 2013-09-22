/**
	_moon.Scroller_ extends <a href="#enyo.Scroller">enyo.Scroller</a>, adding
	support for 5-way focus (Spotlight) and pagination buttons.

	_moon.Scroller_ responds to the _onSpotlightFocused_ event by scrolling the
	event originator into view. This ensures that 5-way (Spotlight) focused
	controls are always in view.

	In addition, _moon.Scroller_ responds to explicit/programmatic requests from
	controls to be scrolled into view via the _onRequestScrollIntoView_ event.

	For more information, see the documentation on
	[Scrollers](https://github.com/enyojs/enyo/wiki/Scrollers) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name:      "moon.Scroller",
	kind:      "enyo.Scroller",
	spotlight: "container",
	published: {
		//* If true, paging controls are hidden if a key is pressed (5-way mode)
		hidePagingOnKey: true,
		//* If true, paging controls are hidden if the user's pointer leaves this
		//* control
		hidePagingOnLeave: true,
		/**
			If true, when scrolling to focused child controls, the scroller will
			scroll as far as possible, until its edge meets the next item's edge
		*/
		scrollFullPage: false,
		//* If true, paging controls are spotlightable (in 5-way mode)
		spotlightPagingControls: false,
		//* Relative parameter used to determine scroll speed
		scrollInterval: 75
	},
	//* If true, scroll events are not allowed to propagate
	preventScrollPropagation: false,
	//* Default to moon.ScrollStrategy
	strategyKind: "moon.ScrollStrategy",

	bindings: [
		{from: ".scrollInterval", to:".$.strategy.interval"}
	],

	/**
		Scrolls until _inControl_ is in view. If _inScrollFullPage_ is set, scrolls
		until the edge of _inControl_ is aligned with the edge of the visible scroll
		area.
	*/
	scrollToControl: function(inControl, inScrollFullPage) {
		this.$.strategy.animateToControl(inControl, inScrollFullPage);
	}
});