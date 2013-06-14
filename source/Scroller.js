/**
	_moon.Scroller_ extends <a href="#enyo.Scroller">enyo.Scroller</a>, adding
	support for 5-way focus (Spotlight) and pagination buttons.

	For the time being, _moon.Scroller_ requires a _strategyKind_ of
	_TouchScrollStrategy_.

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
	touch:     true,
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
		scrollFullPage: false
	},
	//* @protected
	initComponents: function() {
		this.strategyKind = "moon.ScrollStrategy";
		this.inherited(arguments);
	}
});