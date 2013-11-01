/**
	_moon.ScrollStrategy_ inherits from
	<a href="#enyo.TouchScrollStrategy">enyo.TouchScrollStrategy</a>. Its main
	purpose is to handle scroller paging for
	<a href="#moon.Scroller">moon.Scroller</a> and
	<a href="#moon.List">moon.List</a>.
*/

enyo.kind({
	name: "moon.ScrollStrategy",
	kind: "enyo._TransitionScrollStrategy",
	published: {
		//* Scroll speed in pixels per second
		scrollSpeed: 800
	},
	//* @protected
	handlers: {
		onRequestScrollIntoView: "requestScrollIntoView",
		onenter: "enter",
		onleave: "leave",
		onmousewheel: "mousewheel"
	},
	components: [
		{name: "clientContainer", classes: "moon-scroller-client-wrapper", components: [
			{name: "viewport", classes:"moon-scroller-viewport", components: [
				{name: "client", classes: "enyo-touch-scroller matrix-scroll-client matrix3dsurface moon-scroll-client", ontransitionend: "transitionEnd"}
			]}
		]},
		{name: "vColumn", classes: "moon-scroller-v-column", components: [
			{name: "pageUpControl", kind: "moon.PagingControl", side: "top", onBeginHold: "beginPaginateHold", onEndHold: "endPaginateHold", onPaginate: "paginate"},
			{name: "vthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-vthumb-container", components: [
				{name: "vthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-vthumb hidden", axis: "v"}
			]},
			{name: "pageDownControl", kind: "moon.PagingControl", side: "bottom", onBeginHold: "beginPaginateHold", onEndHold: "endPaginateHold", onPaginate: "paginate"}
		]},
		{name: "hColumn", classes: "moon-scroller-h-column", components: [
			{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", onBeginHold: "beginPaginateHold", onEndHold: "endPaginateHold", onPaginate: "paginate"},
			{name: "hthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-hthumb-container", components: [
				{name: "hthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-hthumb hidden", axis: "h"}
			]},
			{name: "pageRightControl", kind: "moon.PagingControl", side: "right", onBeginHold: "beginPaginateHold", onEndHold: "endPaginateHold", onPaginate: "paginate"}
		]},
		{kind: "Signals", onSpotlightModeChanged: "showHidePageControls", isChrome: true}
	],
	//* Bezier timing functions used for different scroll behaviors
	timingFunctions: {
		scroll: {
			controlPoints: [0,0,1,1],
			points: []
		},
		scrollIntoView: {
			controlPoints: [0.25,0.1,0.25,1],
			points: []
		},
		hold: {
			controlPoints: [0,0,1,1],
			points: []
		},
		paginate: {
			controlPoints: [0.35,0.66,0,1],
			points: []
		},
		decelerate: {
			controlPoints: [0,0,0.58,1],
			points: []
		},
		mousewheel: {
			controlPoints: [0,0,0.4,1],
			points: []
		},
		overscroll: {
			controlPoints: [0.25,0.1,0.25,1]
		}
	},
	//* Fraction of the total client height/width to scroll during deceleration
	decelerateScrollMultiplier: 0.3,
	//* Fraction of the total client height/width to scroll on pagination
	paginationScrollMultiplier: 0.9,
	//* Multiplier applied to scroll animations when accelerating (bigger -> faster scrolling)
	accelerationMultiplier: 1.5,
	//* Time interval to wait during scrolling before accelerating
	accelerateIntervalMS: 1500,
	//* Maximum scroll speed in pixels per second
	maxScrollSpeed: null,
	//* Multiple of scroll speed used for _maxScrollSpeed_ if no _maxScrollSpeed_ is specified
	maxScrollSpeedMultiplier: 4,
	//* If true, the scroll speed has accelerated up to the maximum speed
	maxSpeedReached: false,
	//* If true, user is currently holding down a pagination button
	holding: false,
	
	create: function() {
		this.inherited(arguments);
		this.showHideScrollColumns(this.container.spotlightPagingControls);
		this.scrollSpeedChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.updateSpotlightPagingControls();
	},
	scrollSpeedChanged: function() {
		this.maxScrollSpeed = this.maxScrollSpeed || this.scrollSpeed * this.maxScrollSpeedMultiplier;
	},

	//* @public
	
	//* Stops scrolling at current location
	stop: function() {
		this.inherited(arguments);
		this.unmuteSpotlight();
		this.showHidePageControls(true);
	},

	//* @protected
	
	/////////// Event Handlers ///////////

	//* On _enter_, sets _this.hovering_ to true and shows pagination controls.
	enter: function() {
		this.hovering = true;
		this.showHidePageControls();
		this.showHideScrollColumns(true);
	},
	//* On _leave_, sets _this.hovering_ to false and hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHideScrollColumns(false);
	},
	//* Handles _paginate_ event sent from PagingControl buttons.
	paginate: function(inSender, inEvent) {
		this.refreshCachedScrollBounds();
		
		if (this.overscrolling) {
			return true;
		}
		
		var bounds = this.getScrollBounds(true),
			x = this.scrollLeft,
			y = this.scrollTop;
		
		switch (inEvent.side) {
		case "left":
			x = this.scrollLeft - bounds.clientWidth  * this.paginationScrollMultiplier;
			break;
		case "right":
			x = this.scrollLeft + bounds.clientWidth  * this.paginationScrollMultiplier;
			break;
		case "top":
			y = this.scrollTop  - bounds.clientHeight * this.paginationScrollMultiplier;
			break;
		case "bottom":
			y = this.scrollTop  + bounds.clientHeight * this.paginationScrollMultiplier;
			break;
		}
		
		this.setTimingFunction("paginate");
		this._scrollTo(x, y);
		return true;
	},
	//* Kick off the press-and-hold scroll sequence
	beginPaginateHold: function(inSender, inEvent) {
		this.refreshCachedScrollBounds();

		var bounds = this.getScrollBounds(true),
			x = this.scrollLeft,
			y = this.scrollTop;
		
		if (this.overscrolling) {
			return true;
		}
		
		switch (inEvent.side) {
		case "left":
			x = bounds.minLeft - this.overscrollBufferX;
			break;
		case "right":
			x = bounds.maxLeft + this.overscrollBufferX;
			break;
		case "top":
			y = bounds.minTop  - this.overscrollBufferY;
			break;
		case "bottom":
			y = bounds.maxTop  + this.overscrollBufferY;
			break;
		}
		
		this.setTimingFunction("hold");
		this._scrollTo(x, y);
		this.holding = true;
		return true;
	},
	//* End the press-and-hold scroll sequence
	endPaginateHold: function(inSender, inEvent) {
		if (!this.scrolling || !this.holding) {
			return true;
		}

		this.refreshCachedScrollBounds();
		
		var x = this.scrollLeft,
			y = this.scrollTop,
			speed = Math.max(
				this.calcSpeed(x, this.targetLeft, this.scrollDuration),
				this.calcSpeed(y, this.targetTop,  this.scrollDuration)
			);
		
		switch (inEvent.side) {
		case "left":
			x = this.scrollLeft - speed * this.decelerateScrollMultiplier;
			break;
		case "right":
			x = this.scrollLeft + speed * this.decelerateScrollMultiplier;
			break;
		case "top":
			y = this.scrollTop - speed * this.decelerateScrollMultiplier;
			break;
		case "bottom":
			y = this.scrollTop + speed * this.decelerateScrollMultiplier;
			break;
		}
		
		this.setTimingFunction("decelerate");
		this._scrollTo(x, y);
		return true;
	},
	//* Responds to child components' requests to be scrolled into view.
	requestScrollIntoView: function(inSender, inEvent) {
		if (!enyo.Spotlight.getPointerMode() || inEvent.scrollInPointerMode === true) {
			this.calcBoundaries();
			this.enableDisableScrollColumns();
			this.setThumbSizeRatio();
			
			if (this.showVertical() || this.showHorizontal()) {
				this.animateToControl(inEvent.originator, inEvent.scrollFullPage);
				return true;
			} else {
				// Scrollers that don't need to scroll bubble their onRequestScrollIntoView,
				// to allow items in nested scrollers to be scrolled
				return false;
			}
		}
		return true;
	},
	
	///////// End Event Handlers /////////
	
	
	//* In addition to inherited behavior, mute spotlight if not already scrolling
	_scrollTo: function() {
		if (!this.scrolling) {
			this.muteSpotlight();
		}
		
		this.inherited(arguments);
	},
	//* Add a check for acceleration to scroll loop
	scroll: function() {
		this.inherited(arguments);
		
		var timeElapsed = enyo.bench() - this.scrollStartTime;
		
		// Optionally accelerate scroll speed
		if (this.shouldAccelerate(timeElapsed)) {
			this.accelerateScrolling(timeElapsed);
		}
	},
	shouldAccelerate: function(inTimeElapsed) {
		return this.holding && !this.maxSpeedReached && inTimeElapsed > this.accelerateIntervalMS;
	},
	accelerateScrolling: function(inTimeElapsed) {
		var left = (this.targetLeft === null) ? this.scrollLeft : this.targetLeft,
			top = (this.targetTop === null) ? this.scrollTop : this.targetTop,
			duration = (this.scrollDuration - inTimeElapsed)/this.accelerationMultiplier;
		
		this.stabilize();
		this.endScrollJob();
		this.twiddleThumbs();
		
		// If we have accelerated past the max speed, throttle speed and update duration
		if (this.shouldThrottleSpeed(left, top, duration)) {
			this.maxSpeedReached = true;
			duration = Math.max(
				this.calcDuration(this.scrollLeft, left, this.maxScrollSpeed),
				this.calcDuration(this.scrollTop,  top,  this.maxScrollSpeed)
			);
		}
		
		// If not done asynchronously, the new translation doesn't take
		this.startJob("accelerate", function() { this.startScrolling(left, top, duration); }, 0);
	},
	bounceBack: function() {
		this.holding = false;
		this.inherited(arguments);
	},
	resetScrollValues: function() {
		this.inherited(arguments);
		this.maxSpeedReached = false;
		this.holding = false;
	},
	updateSpotlightPagingControls: function() {
		enyo.forEach([
			this.$.pageLeftControl,
			this.$.pageRightControl,
			this.$.pageUpControl,
			this.$.pageDownControl
		], function(c) {
			c.spotlight = this.container.spotlightPagingControls;
			c.addRemoveClass("hover", !this.container.spotlightPagingControls);
		}, this);
	},
	/**
		Because the thumb columns are a fixed size that impacts the scrollbounds,
		we need to capture the difference for use in thumb rendering math.
	*/
	setThumbSizeRatio: function() {
		var scrollBounds = this.getScrollBounds(true);
		
		if (this.showHorizontal()) {
			this.$.hthumb.setSizeRatio(this.getHorizontalThumbBounds().width/scrollBounds.clientWidth);
		}
		if (this.showVertical()) {
			this.$.vthumb.setSizeRatio(this.getVerticalThumbBounds().height/scrollBounds.clientHeight);
		}
	},
	//* Returns true if _inControl_ is one of four page controls.
	isPageControl: function(inControl) {
		return (
			inControl === this.$.pageUpControl ||
			inControl === this.$.pageDownControl ||
			inControl === this.$.pageLeftControl ||
			inControl === this.$.pageRightControl
		);
	},
	//* Shows or hides pagination controls, as appropriate.
	showHidePageControls: function(inNoCalc) {
		if (!inNoCalc) {
			this.calcBoundaries();
		}
		
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
		
		if (!this.shouldShowPageControls()) {
			this.hidePageControls();
			return;
		}
		
		if (!this.container.spotlightPagingControls) {
			this.$.pageUpControl.addRemoveClass("hidden",		(this.scrollTop  <= this.topBoundary));
			this.$.pageDownControl.addRemoveClass("hidden",		(this.scrollTop  >= this.bottomBoundary));
			this.$.pageLeftControl.addRemoveClass("hidden",		(this.scrollLeft <= this.leftBoundary));
			this.$.pageRightControl.addRemoveClass("hidden",	(this.scrollLeft >= this.rightBoundary));
		}
	},
	//* Enables or disables vertical scroll column.
	enableDisableVerticalScrollControls: function(inEnabled) {
		this.inherited(arguments);
		this.$.pageUpControl.spotlight = inEnabled && this.container.spotlightPagingControls;
		this.$.pageDownControl.spotlight = inEnabled && this.container.spotlightPagingControls;
	},
	//* Enables or disables horizontal scroll column.
	enableDisableHorizontalScrollControls: function(inEnabled) {
		this.inherited(arguments);
		this.$.pageLeftControl.spotlight = inEnabled && this.container.spotlightPagingControls;
		this.$.pageRightControl.spotlight = inEnabled && this.container.spotlightPagingControls;
	},
	//* Shows or hides vertical scroll columns.
	showHideVerticalScrollColumns: function(inShow) {
		this.$.vColumn.addRemoveClass("visible", inShow || this.container.spotlightPagingControls);
	},
	//* Shows or hides horizontal scroll columns.
	showHideHorizontalScrollColumns: function(inShow) {
		this.$.hColumn.addRemoveClass("visible", inShow || this.container.spotlightPagingControls);
	},
	//* Returns boolean indicating whether page controls should be shown for this scroller.
	shouldShowPageControls: function() {
		return (enyo.Spotlight.getPointerMode() && this.hovering);
	},
	//* Determines whether we should be showing the vertical scroll column.
	showVertical: function() {
		return (this.getVertical() === "scroll" ||
				(this.getVertical() !== "hidden" && (this.bottomBoundary > 0 || this.container.spotlightPagingControls)));
	},
	//* Determines whether we should be showing the horizontal scroll column.
	showHorizontal: function() {
		return (this.getHorizontal() === "scroll" ||
				(this.getHorizontal() !== "hidden" && (this.rightBoundary > 0 || this.container.spotlightPagingControls)));
	},
	//* Hides pagination controls.
	hidePageControls: function() {
		if (!this.container.spotlightPagingControls) {
			this.$.pageLeftControl.addClass("hidden");
			this.$.pageRightControl.addClass("hidden");
			this.$.pageUpControl.addClass("hidden");
			this.$.pageDownControl.addClass("hidden");
		}
	},
	//* Mute spotlight if not already muted
	muteSpotlight: function() {
		if (!enyo.Spotlight.isMuted()) {
			enyo.Spotlight.unspot();
			enyo.Spotlight.mute(this);
		}
	},
	//* Unmute spotlight if muted
	unmuteSpotlight: function() {
		if (enyo.Spotlight.isMuted()) {
			enyo.Spotlight.unmute(this);
		}
	}
});
