/**
	_moon.Scroller_ extends [enyo.Scroller](#enyo.Scroller), adding support for
	5-way focus (Spotlight) and pagination buttons.

	_moon.Scroller_ responds to the _onSpotlightFocused_ event by scrolling the
	event originator into view. This ensures that 5-way (Spotlight) focused
	controls are always in view.

	In addition, _moon.Scroller_ responds to explicit/programmatic requests from
	controls to be scrolled into view via the _onRequestScrollIntoView_ event.

	For more information, see the documentation on
	[Scrollers](building-apps/layout/scrollers.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name:      "moon.Scroller",
	kind:      "enyo.Scroller",
	//* @protected
	spotlight: "container",
	//* @public
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
		/**
			If true, paging controls are focusable (in 5-way mode).  Normally, this
			is not required, since the scroller will automatically scroll to ensure
			most focusable items are in view.  It is intended to be used when the 
			scroller contents have no spotlightable controls, such as the case of a 
			scroller with a long body of text. 
		*/
		spotlightPagingControls: false,
		//* Relative parameter used to determine scroll speed
		scrollInterval: 75,
		/** 
			Defines the ratio of mousewheel "delta" units to pixels scrolled.  Increase this value to increase
			the distance scrolled by the scroll wheel.  Note, mice/trackpads do not emit the same "delta" units
			per "notch" or flick of the scroll wheel/trackpad; that can vary based on intensity and momentum.
		*/
		scrollWheelMultiplier: 2,
		/** 
			Defines the maximum distance scrolled by each scroll wheel event, as a rato of the viewport height/width.
			Setting to larger than 1 is not advised, since a single scroll event could move more than one viewport's
			worth of content (depending on the delta received), skipping content.
		*/
		scrollWheelPageMultiplier: 0.2,
		/** 
			Defines the distance scrolled per tap of the paging button, as a rato of the viewport height/width.
			Setting to larger than 1 is not advised, since a paging button tap will move more than one viewport's
			worth of content, skipping content.
		*/
		paginationPageMultiplier: 0.8,
		/** 
			Defines the ratio of continuous-scrolling delta units to pixels scrolled.
			Increase this value to increase the distance scrolled by holding the pagination buttons.
		*/
		paginationScrollMultiplier: 8,
		/** 
			When true, the scroll wheel moves spotlight focus up/down through the scroller when in 5-way mode
			(in pointer mode, scroll wheel always scrolls the viewport without modifying focus position).
			When false, the scroll wheel works the same in 5-way mode and pointer mode, where the wheel moves
			the position of the scroller viewport.
		*/
		scrollWheelMovesFocus: true
	},
	//* @protected
	handlers: {
		onSpotlightScrollUp:"spotlightWheel",
		onSpotlightScrollDown:"spotlightWheel",
		onSpotlightContainerEnter: "spotlightHello",
		onSpotlightFocus: "spotlightHello",
		onSpotlightContainerLeave: "spotlightGoodbye"
	},
	//* If true, scroll events are not allowed to propagate
	preventScrollPropagation: false,
	//* Default to moon.ScrollStrategy
	strategyKind: "moon.ScrollStrategy",
	/**
		Scrolls until _inControl_ is in view. If _inScrollFullPage_ is set, scrolls
		until the edge of _inControl_ is aligned with the edge of the visible scroll
		area. Optional third parameter to indicate whether or not it should animate
		the scroll. Defaults to animation unless it is set to false.
	*/
	scrollToControl: function(inControl, inScrollFullPage, animate) {
		this.$.strategy.animateToControl(inControl, inScrollFullPage, animate);
	},

	/**
		Accepts third optional paramater to indicate whether or not it should
		animate the scroll. Defaults to animation unless it is set to false.
	*/
	scrollTo: function (x, y, animate) {
		this.$.strategy.scrollTo(x, y, animate);	
	},
		
	//* @protected
	bindings: [
		{from: ".scrollInterval",				to:".$.strategy.interval"},
		{from: ".scrollWheelMultiplier",		to:".$.strategy.scrollWheelMultiplier"},
		{from: ".scrollWheelPageMultiplier",	to:".$.strategy.scrollWheelPageMultiplier"},
		{from: ".paginationPageMultiplier",		to:".$.strategy.paginationPageMultiplier"},
		{from: ".paginationScrollMultiplier",	to:".$.strategy.paginationScrollMultiplier"}
	],
	create: function() {
		this.inherited(arguments);
		this.spotlightPagingControlsChanged();
		this.scrollWheelMovesFocusChanged();
	},
	spotlightPagingControlsChanged: function() {
		// Since spotlightPagingControls is used when there are no focusable
		// children, turn off container handling in that case.
		this.spotlight = this.spotlightPagingControls ? false : "container";
		this.$.strategy.set("spotlightPagingControls", this.spotlightPagingControls);
	},
	scrollWheelMovesFocusChanged: function() {
		if (!this.scrollWheelMovesFocus) {
			this.setUseMouseWheel(true);
		}
	},
	spotlightWheel: function(inSender, inEvent) {
		if (this.scrollWheelMovesFocus) {
			if (!enyo.Spotlight.getPointerMode()) {
				var curr = enyo.Spotlight.getCurrent();
				if (curr && curr.isDescendantOf(this)) {
					var dir = inEvent.type == "onSpotlightScrollUp" ? "onSpotlightUp" : "onSpotlightDown";
					this._spotlightModal = this.spotlightModal;
					this.spotlightModal = true;	// Trap focus inside scroller while wheeling
					enyo.Spotlight.Util.dispatchEvent(dir, {type: dir}, curr);
					this.spotlightModal = this._spotlightModal;
					return true;
				}
			}
		}
	},
	// When scroller is entered or one of its children is focused
	// in 5-way mode, make sure that we're showing the scroll columns
	spotlightHello: function(inSender, inEvent) {
		if (this.$.strategy.showHideScrollColumns) {
			this.$.strategy.showHideScrollColumns(true);
		}
	},
	// When 5-way focus leaves scroller, hide the scroll columns
	spotlightGoodbye: function(inSender, inEvent) {
		if (inEvent.originator === this && this.$.strategy.showHideScrollColumns) {
			this.$.strategy.showHideScrollColumns(false);
		}
	},
	previewDomEvent: function(inEvent) {
		if (this.scrollWheelMovesFocus) {
			if (inEvent.type == "mousewheel") {
				this.setUseMouseWheel(enyo.Spotlight.getPointerMode());
			}
		}
	}
});