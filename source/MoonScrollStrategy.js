/**
	_moon.ScrollStrategy_ inherits from
	<a href="#enyo.TouchScrollStrategy">enyo.TouchScrollStrategy</a>. Its main
	purpose is to handle scroller paging for
	<a href="#moon.Scroller">moon.Scroller</a> and
	<a href="#moon.List">moon.List</a>.
*/

enyo.kind({
	name: "moon.ScrollStrategy",
	kind: "enyo.ScrollStrategy",
	published: {
		//* Scroll speed in pixels per second
		scrollSpeed: 800
	},
	events: {
		//* Fires when scroll action starts.
		onScrollStart: "",
		//* Fires while scroll action is in progress.
		onScroll: "",
		//* Fires when scroll action stops.
		onScrollStop: ""
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
			{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", onPaginateScroll: "paginateScroll", onPaginate: "paginate"},
			{name: "hthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-hthumb-container", components: [
				{name: "hthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-hthumb hidden", axis: "h"}
			]},
			{name: "pageRightControl", kind: "moon.PagingControl", side: "right", onPaginateScroll: "paginateScroll", onPaginate: "paginate"}
		]},
		{kind: "Signals", onSpotlightModeChanged: "showHidePageControls", isChrome: true}
	],
	//* Current bezier timing function
	timingFunction: null,
	//* Bezier timing functions used for different scroll behaviors
	timingFunctions: {
		scroll: {
			controlPoints: [0,0,1,1],
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
	//* Fraction of the total client height/width to scroll on pagination
	paginationScrollMultiplier: 0.9,
	//* Fraction of the total client height/width to scroll during deceleration
	decelerateScrollMultiplier: 0.3,
	//* Larger numbers -> faster mousewheel scrolling
	mouseWheelMultiplier: 4,
	//* Duration of mousewheel scroll animations
	mousewheelDurationMS: 400,
	//* Multiplier applied to scroll animations when accelerating (bigger -> faster scrolling)
	accelerationMultiplier: 1.5,
	//* Time interval to wait during scrolling before accelerating
	accelerateIntervalMS: 1500,
	//* Interval in MS between emitting onScroll events
	scrollBubbleIntervalMS: 30,
	//* Current scroll animation initial left position
	initialLeft: null,
	//* Current scroll animation initial top position
	initialTop: null,
	//* Current scroll animation target left position
	targetLeft: null,
	//* Current scroll animation target top position
	targetTop: null,
	//* If true, scroll animation is currently taking place
	scrolling: false,
	//* Maximum scroll speed in pixels per second
	maxScrollSpeed: null,
	//* Maximum distance in pixels to overscroll
	maxOverscrollDistance: 300,
	//* Time in MS for overscroll to bounce back
	overscrollDurationMS: 800,
	//* Optional callback to be called directly when scrolling (rather than bubbling scroll event)
	scrollListenerCallback: null,
	//* Optional scrollbounds thresholds used to determine when to call _this.scrollListenerCallback_
	scrollThreshold: null,
	
	
	create: function() {
		this.inherited(arguments);
		this.accel = enyo.dom.canAccelerate();
		this.transformProp = enyo.dom.getCssTransformProp();
		this.transitionProp = enyo.dom.transition;
		this.container.addClass("enyo-touch-strategy-container");
		this.showHideScrollColumns(this.container.spotlightPagingControls);
		this.scrollSpeedChanged();
		this.timingFunctionsChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.calcBoundaries();
		this.setupBounds();
		this.updateSpotlightPagingControls();
		this.effectScrollStop();
	},
	resizeHandler: function() {
		this.resetCachedValues();
		this.setupBounds();
	},
	setupBounds: function() {
		this.calcBoundaries();
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
	},
	//* Override _maxHeightChanged()_. Content should cover scroller at a minimum if there's no max-height.
	maxHeightChanged: function() {
		this.$.client.applyStyle("min-height", this.maxHeight ? null : "100%");
		this.$.client.applyStyle("max-height", this.maxHeight);
		this.$.clientContainer.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
	},
	scrollSpeedChanged: function() {
		this.maxScrollSpeed = this.maxScrollSpeed || this.scrollSpeed * 5;
	},
	timingFunctionsChanged: function() {
		for (var func in this.timingFunctions) {
			this.timingFunctions[func].points = this.calcBezierPoints(this.timingFunctions[func].controlPoints);
		}
	},
	
	bounce: function() {
		this.scrollTo(0, -200);
	},

	//* @public
	
	//* Sets the top scroll position within the scroller without animation.
	setScrollLeft: function(inLeft) {
		this.scrollLeft = inLeft;
		
		if (this.scrolling) {
			this._stop();
		}
		
		this.effectScrollStop();
	},
	//* Sets the top scroll position within the scroller without animation.
	setScrollTop: function(inTop) {
		this.scrollTop = inTop;
		
		if (this.scrolling) {
			this._stop();
		}
		
		this.effectScrollStop();
	},
	//* Returns current scroll left position
	getScrollLeft: function() {
		if (this.scrolling) {
			this.syncScrollPosition();
		}
		return this.scrollLeft;
	},
	//* Returns current scroll top
	getScrollTop: function() {
		if (this.scrolling) {
			this.syncScrollPosition();
		}
		return this.scrollTop;
	},
	//* Scrolls to specific x/y positions within the scroll area.
	scrollTo: function(inX, inY) {
		this.setTimingFunction("scroll");
		this._scrollTo(inX, inY);
	},
	//* Stops scrolling at current location
	stop: function(inSilence) {
		this.stabilize();
		this._stop(inSilence);
	},
	//* Add a function to be called directly rather than bubbling scroll events
	addScrollListener: function(inFunction) {
		this.scrollListenerCallback = inFunction;
	},
	//* Setup scroll thresholds used by strategy to notify scroll listener
	setScrollThreshold: function(inScrollThreshold) {
		this.scrollThreshold = inScrollThreshold;
	},
	//* Update current timing function via string name
	setTimingFunction: function(inName) {
		this.timingFunction = this.timingFunctions[inName] || this.timingFunctions.scroll;
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
	//* On _mousewheel_, scrolls a fixed amount.
	mousewheel: function(inSender, inEvent) {
		this.scrollBounds = this.getScrollBounds();
		
		var x = 0, y = 0, dx = 0, dy = 0,
			delta = inEvent.wheelDelta || 0,
			vertical = this.showVertical(),
			horizontal = this.showHorizontal();
		
		// If we don't have to scroll, allow mousewheel event to bubble
		if (!vertical && !horizontal) {
			return false;
		}
		
		// If vertical scrolling enabled, get deltaY
		if (vertical) {
			dy = inEvent.wheelDeltaY || delta;
			delta = 0;
		}
		
		// If horizontal scrolling enabled, get deltaX
		if (horizontal) {
			dx = inEvent.wheelDeltaX || delta;
		}
		
		dx *= this.mouseWheelMultiplier;
		dy *= this.mouseWheelMultiplier;
		
		x = this.scrollBounds.left - dx;
		y = this.scrollBounds.top - dy;
		
		if (this.scrolling) {
			this.twiddleThumbs();
			this.stop(true);
		}
		
		this.setTimingFunction("mousewheel");
		this._scrollTo(x, y, this.mousewheelDurationMS);
		this.scrollBounds = null;
		inEvent.preventDefault();
		return true;
	},
	//* Handles _paginate_ event sent from PagingControl buttons.
	paginate: function(inSender, inEvent) {
		this.scrollBounds = this.getScrollBounds();
		
		var x = this.scrollLeft,
			y = this.scrollTop;
		
		switch (inEvent.side) {
		case "left":
			x = this.scrollLeft - this.scrollBounds.clientWidth * this.paginationScrollMultiplier;
			break;
		case "right":
			x = this.scrollLeft + this.scrollBounds.clientWidth * this.paginationScrollMultiplier;
			break;
		case "top":
			y = this.scrollTop - this.scrollBounds.clientHeight * this.paginationScrollMultiplier;
			break;
		case "bottom":
			y = this.scrollTop + this.scrollBounds.clientHeight * this.paginationScrollMultiplier;
			break;
		}
		
		this.setTimingFunction("paginate");
		this._scrollTo(x, y);
		this.scrollBounds = null;
		return true;
	},
	//* Kick off the press-and-hold scroll sequence
	beginPaginateHold: function(inSender, inEvent) {
		this.scrollBounds = this.getScrollBounds();

		var x = this.scrollLeft,
			y = this.scrollTop;
		
		switch (inEvent.side) {
		case "left":
			x = this.scrollBounds.minLeft;
			break;
		case "right":
			x = this.scrollBounds.maxLeft;
			break;
		case "top":
			y = this.scrollBounds.minTop;
			break;
		case "bottom":
			y = this.scrollBounds.maxTop;
			break;
		}
		
		this.setTimingFunction("hold");
		this._scrollTo(x, y);
		this.scrollBounds = null;
		return true;
	},
	//* End the press-and-hold scroll sequence
	endPaginateHold: function(inSender, inEvent) {
		if (!this.scrolling) {
			return true;
		}
		
		this.scrollBounds = this.getScrollBounds();
		
		var x = this.scrollLeft,
			y = this.scrollTop,
			speed = this.calcScrollSpeed(this.initialTop, this.scrollTop, this.scrollDuration) * 100;
		
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
		this._scrollTo(x, y, null, true, true);
		this.scrollBounds = null;
		return true;
	},
	//* Called when css scroll transition completes
	transitionEnd: function(inSender, inEvent) {
		if (inEvent.originator === this.$.client) {
			this.syncScrollPosition();
			this.scrollBounds = this.getScrollBounds();
			
			if (this.isOverscrolling()) {
				this.bounceBack();
			} else {
				this._stop();
			}
			
			this.scrollBounds = null;
			return true;
		}
	},
	isOverscrolling: function() {
		return this.isOverscrollingX() || this.isOverscrollingY();
	},
	isOverscrollingX: function(inX) {
		var bounds = this.getScrollBounds();
		inX = inX || bounds.left;
		return inX < bounds.minLeft || inX > bounds.maxLeft;
	},
	isOverscrollingY: function(inY) {
		var bounds = this.getScrollBounds();
		inY = inY || bounds.top;
		return inY < bounds.minTop || inY > bounds.maxTop;
	},
	bounceBack: function() {
		var bounds = this.getScrollBounds(),
			x = (bounds.left < bounds.minLeft) ? bounds.minLeft :
				(bounds.left > bounds.maxLeft) ? bounds.maxLeft :
				bounds.left,
			y = (bounds.top < bounds.minTop) ? bounds.minTop :
				(bounds.top > bounds.maxTop) ? bounds.maxTop :
				bounds.top;

		this.setTimingFunction("overscroll");
		this.updateScrollValues(x, y, this.overscrollDurationMS);
		this.effectOverscroll(x, y);
		this.start(true);
	},
	
	
	///////// End Event Handlers /////////
	
	
	//* Scrolls to specific x/y positions within the scroll area.
	_scrollTo: function(inX, inY, inDuration, inSilence, inNoMute) {
		inX = this.clampX(inX);
		inY = this.clampY(inY);
		
		// TODO - should maxSpeed force extended scroll duration?
		inDuration = this.calcDuration(inX, inY, inDuration);
		
		// Only scroll to new positions
		if (inX === this.scrollLeft && inY === this.scrollTop) {
			return;
		}
		
		// Unless otherwise specified, mute spotlight
		if (!inNoMute) {
			this.muteSpotlight();
		}
		
		// Go scroll
		this.updateScrollValues(inX, inY, inDuration);
		this.effectScroll(inX, inY, inDuration);
		this.start(inSilence);
	},
	start: function(inSilence) {
		if (!inSilence && !this.scrolling) {
			this.doScrollStart();
		}

		this.scrolling = true;
		this.scroll();
	},
	scroll: function() {
		var timeElapsed = enyo.bench() - this.scrollStartTime;
		
		// Stop bubbling scroll events if we've passed total allotted scroll time
		if (timeElapsed > this.scrollDuration) {
			return;
		}
		
		this.syncScrollPosition(timeElapsed);
		this.sendScrollEvent();
		
		// Optionally accelerate scroll speed
		if (!this.maxSpeedReached && timeElapsed > this.accelerateIntervalMS) {
			this.accelerateScrolling(timeElapsed);
			return;
		}
		
		// Kickoff next scroll() call
		this.startScrollJob();
	},
	//* If a listener is set, check threshold, otherwise bubble scroll event
	sendScrollEvent: function() {
		if (this.scrollListenerCallback) {
			this.checkScrollThreshold();
		} else {
			this.doScroll();
		}
	},
	checkScrollThreshold: function() {
		if (this.yDir === -1 && this.scrollTop  < this.scrollThreshold.top ||
			this.yDir ===  1 && this.scrollTop  > this.scrollThreshold.bottom ||
			this.xDir === -1 && this.scrollLeft < this.scrollThreshold.left ||
			this.xDir ===  1 && this.scrollLeft > this.scrollThreshold.right
		) {
			this.scrollListenerCallback(this.getScrollBounds());
		}
	},
	accelerateScrolling: function(inTimeElapsed) {
		var left = (this.targetLeft === null) ? this.scrollLeft : this.targetLeft,
			top = (this.targetTop === null) ? this.scrollTop : this.targetTop,
			duration = (this.scrollDuration - inTimeElapsed)/this.accelerationMultiplier;
		
		this.twiddleThumbs();
		this.stop(true);
		this._scrollTo(left, top, duration, true, true);
	},
	startScrollJob: function() {
		this.startJob("scroll", "scroll", this.scrollBubbleIntervalMS);
	},
	endScrollJob: function() {
		this.stopJob("scroll");
	},
	calcBezierPoints: function(inControlPoints) {
		var curvePoints = [
				{x: 0, y: 0},
				{x: inControlPoints[0], y: inControlPoints[1]},
				{x: inControlPoints[2], y: inControlPoints[3]},
				{x: 1, y: 1}
			],
			point, x, y, i,
			points = [];
		
		for (i = 0; i <= 1; i+= 0.01) {
			point = this.casteljausAlgorithm(i, curvePoints);
			x = Math.round(point.x*100);
			y = Math.round(point.y*100);
			points[x] = y;
		}
		
		return points;
	},
	casteljausAlgorithm: function(t, p) {
		var a = {
				x: ((1 - t) * p[0].x) + (t * p[1].x),
				y: ((1 - t) * p[0].y) + (t * p[1].y)
			},
			b = {
				x: ((1 - t) * p[1].x) + (t * p[2].x),
				y: ((1 - t) * p[1].y) + (t * p[2].y)
			},
			c = {
				x: ((1 - t) * p[2].x) + (t * p[3].x),
				y: ((1 - t) * p[2].y) + (t * p[3].y)
			},
			d = {
				x: ((1 - t) * a.x) + (t * b.x),
				y: ((1 - t) * a.y) + (t * b.y)
			},
			e = {
				x: ((1 - t) * b.x) + (t * c.x),
				y: ((1 - t) * b.y) + (t * c.y)
			};
		return {
			x: ( (1 - t) * d.x) + (t * e.x),
			y: ( (1 - t) * d.y) + (t * e.y)
		};
	},
	estimateCurrentPosition: function(timeElapsed) {
		var pctComplete = Math.round((1 - (this.scrollDuration - timeElapsed)/this.scrollDuration) * 100),
			distanceToTimeRatio = this.lookupBezierDistancePercentageAtTime(pctComplete)/100,
			distanceX = this.targetLeft - this.initialLeft,
			distanceY = this.targetTop - this.initialTop,
			x = this.initialLeft + distanceToTimeRatio * distanceX,
			y = this.initialTop + distanceToTimeRatio * distanceY;
		return {x: x, y: y};
	},
	lookupBezierDistancePercentageAtTime: function(inTime) {
		return  (inTime >= 100) ? 100 :
				(inTime <= 0) ? 0 :
				(typeof this.timingFunction.points[inTime] === "undefined") ? this.lookupBezierDistancePercentageAtTime(++inTime) :
				this.timingFunction.points[inTime];
	},
	_stop: function(inSilence) {
		this.endScrollJob();
		this.syncScrollPosition();
		
		if (!inSilence && this.scrolling) {
			if (!this.scrollListenerCallback) {
				this.doScroll();
			}
			this.doScrollStop();
		}
		
		this.scrolling = false;
		this.unmuteSpotlight();
		this.delayHideThumbs(500);
		this.showHidePageControls();
		
		this.targetLeft = null;
		this.targetTop = null;
		this.initialLeft = null;
		this.initialTop = null;
		this.maxSpeedReached = false;
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
	calcBoundaries: function() {
		var b = this.getScrollBounds();
		
		this.topBoundary = 0;
		this.leftBoundary = 0;
		this.bottomBoundary = b.maxTop;
		this.rightBoundary = b.maxLeft;
	},
	stabilize: function() {
		this.syncScrollPosition();
		this.effectScrollStop();
	},
	//* This is heavy as it interrogates the DOM - only call when absolutely necessary!
	syncScrollPosition: function(inTimeElapsed) {
		var currentPosition = (inTimeElapsed) ? this.estimateCurrentPosition(inTimeElapsed) : this.calcCurrentPosition();
		this.scrollLeft = currentPosition.x;
		this.scrollTop = currentPosition.y;
	},
	updateScrollValues: function(inX, inY, inDuration) {
		this.scrollDuration = inDuration;
		this.targetLeft = inX;
		this.targetTop = inY;
		this.initialLeft = this.scrollLeft;
		this.initialTop = this.scrollTop;
		this.xDir = (this.targetLeft < this.initialLeft) ? -1 : (this.targetLeft > this.initialLeft) ? 1 : 0;
		this.yDir = (this.targetTop < this.initialTop) ? -1 : (this.targetTop > this.initialTop) ? 1 : 0;
		this.scrollStartTime = enyo.bench();
	},
	effectScroll: function(inX, inY, inDuration) {
		this.$.client.addStyles(this.generateTransitionStyleString(inDuration/1000) + this.generateTransformStyleString(inX, inY));
		this.showThumbs(inDuration);
	},
	effectScrollStop: function() {
		this.$.client.addStyles(this.transitionProp + ": " + this.transformProp + " 0s linear; " + this.generateTransformStyleString(this.scrollLeft, this.scrollTop));
	},
	effectOverscroll: function(inX, inY) {
		this.$.client.addStyles(this.generateTransitionStyleString(this.overscrollDurationMS/1000) + this.generateTransformStyleString(inX, inY));
	},
	generateTransitionStyleString: function(inDuration) {
		return this.transitionProp + ": " + this.transformProp + " " + inDuration + "s " + this.generateTimingFunctionString() + "; ";
	},
	generateTransformStyleString: function(inX, inY) {
		return this.accel	? this.transformProp + ": translate3d(" + -1 * inX + "px, " + -1 * inY + "px, 0); "
							: this.transformProp + ": translate(" + -1 * inX + "px, " + -1 * inY + "px); ";
	},
	//* Convert bezier points to css-compatible transition timing string
	generateTimingFunctionString: function() {
		return "cubic-bezier(" + this.timingFunction.controlPoints[0] + "," + this.timingFunction.controlPoints[1] + "," + this.timingFunction.controlPoints[2] + "," + this.timingFunction.controlPoints[3] + ")";
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
		var scrollBounds = this.getScrollBounds();
		
		if (this.showHorizontal()) {
			this.$.hthumb.setSizeRatio(this.getHorizontalThumbBounds().width/scrollBounds.clientWidth);
		}
		if (this.showVertical()) {
			this.$.vthumb.setSizeRatio(this.getVerticalThumbBounds().height/scrollBounds.clientHeight);
		}
	},
	//* Responds to child components' requests to be scrolled into view.
	requestScrollIntoView: function(inSender, inEvent) {
		if (!enyo.Spotlight.getPointerMode() || inEvent.scrollInPointerMode === true) {
			this.scrollBounds = this.getScrollBounds();
			this.setupBounds();
			if (this.showVertical() || this.showHorizontal()) {
				this.animateToControl(inEvent.originator, inEvent.scrollFullPage);
				this.scrollBounds = null;
				return true;
			} else {
				// Scrollers that don't need to scroll bubble their onRequestScrollIntoView,
				// to allow items in nested scrollers to be scrolled
				this.scrollBounds = null;
				return false;
			}
		}
		return true;
	},
	//* Shows or hides pagination controls, as appropriate.
	showHidePageControls: function() {
		this.setupBounds();
		
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
	//* Enables or disables scroll columns.
	enableDisableScrollColumns: function() {
		this.enableDisableVerticalScrollControls(this.showVertical());
		this.enableDisableHorizontalScrollControls(this.showHorizontal());
	},
	//* Enables or disables vertical scroll column.
	enableDisableVerticalScrollControls: function(inEnabled) {
		this.$.clientContainer.addRemoveClass("v-scroll-enabled", inEnabled);
		this.$.vColumn.addRemoveClass("v-scroll-enabled", inEnabled);
		this.$.hColumn.addRemoveClass("v-scroll-enabled", inEnabled);
		this.$.pageUpControl.spotlight = inEnabled && this.container.spotlightPagingControls;
		this.$.pageDownControl.spotlight = inEnabled && this.container.spotlightPagingControls;
	},
	//* Enables or disables horizontal scroll column.
	enableDisableHorizontalScrollControls: function(inEnabled) {
		this.$.clientContainer.addRemoveClass("h-scroll-enabled", inEnabled);
		this.$.vColumn.addRemoveClass("h-scroll-enabled", inEnabled);
		this.$.hColumn.addRemoveClass("h-scroll-enabled", inEnabled);
		this.$.pageLeftControl.spotlight = inEnabled && this.container.spotlightPagingControls;
		this.$.pageRightControl.spotlight = inEnabled && this.container.spotlightPagingControls;
	},
	//* Shows or hides scroll columns.
	showHideScrollColumns: function(inShow) {
		this.showHideVerticalScrollColumns(inShow);
		this.showHideHorizontalScrollColumns(inShow);
	},
	//* Shows or hides vertical scroll columns.
	showHideVerticalScrollColumns: function(inShow) {
		this.$.vColumn.addRemoveClass("visible", inShow || this.container.spotlightPagingControls);
	},
	//* Shows or hides horizontal scroll columns.
	showHideHorizontalScrollColumns: function(inShow) {
		this.$.hColumn.addRemoveClass("visible", inShow || this.container.spotlightPagingControls);
	},
	/**
		Returns boolean indicating whether page controls should be shown at all for
		this scroller.
	*/
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
	getScrollBounds: function() {
		if (this.scrollBounds) {
			return this.scrollBounds;
		}
		
		var containerBounds = this.getContainerBounds(),
			s = this.getScrollSize(),
			b = {
				top: this.scrollTop,
				left: this.scrollLeft,
				clientHeight: containerBounds.height,
				clientWidth: containerBounds.width,
				height: s.height,
				width: s.width,
				xDir: this.xDir,
				yDir: this.yDir
			};
		
		b.minLeft = 0;
		b.maxLeft = Math.max(0, b.width - b.clientWidth);
		b.minTop = 0;
		b.maxTop = Math.max(0, b.height - b.clientHeight);

		return b;
	},
	_getScrollBounds: function() {
		return this.getScrollBounds();
	},
	getContainerBounds: function() {
		var containerBounds = this.$.clientContainer.getBounds();
		if (containerBounds) {
			var paddingExtents = enyo.dom.calcPaddingExtents(this.$.clientContainer.hasNode());
			containerBounds.width  -= (paddingExtents.left + paddingExtents.right);
			containerBounds.height -= (paddingExtents.top  + paddingExtents.bottom);
		}
		return containerBounds;
	},
	getVerticalThumbBounds: function() {
		return this.vBounds ? this.vBounds : this.$.vthumbContainer.getBounds();
	},
	getHorizontalThumbBounds: function() {
		return this.hBounds ? this.hBounds : this.$.hthumbContainer.getBounds();
	},
	resetCachedValues: function() {
		this.vBounds = null;
		this.hBounds = null;
		this.scrollBounds = null;
	},
	/**
		Scrolls until _inControl_ is in view. If _inScrollFullPage_ is set, scrolls
		until the edge of _inControl_ is aligned with the edge of the visible scroll
		area.
	*/
	animateToControl: function(inControl, inScrollFullPage) {
		var controlBounds  = enyo.Spotlight.Util.getAbsoluteBounds(inControl),
			absoluteBounds = enyo.Spotlight.Util.getAbsoluteBounds(this.container),
			scrollBounds   = this.getScrollBounds(),
			offsetTop      = controlBounds.top - absoluteBounds.top,
			offsetLeft     = controlBounds.left - absoluteBounds.left,
			offsetHeight   = controlBounds.height,
			offsetWidth    = controlBounds.width,
			xDir,
			yDir,
			x,
			y
		;

		// Allow local inScrollFullPage param to override scroller property
		inScrollFullPage = (typeof inScrollFullPage === "undefined") ? this.container.getScrollFullPage() : inScrollFullPage;

		// 0: currently visible, 1: right of viewport, -1: left of viewport
		xDir = (offsetLeft >= scrollBounds.left && offsetLeft + offsetWidth <= scrollBounds.left + scrollBounds.clientWidth)
			? 0
			: offsetLeft - scrollBounds.left > 0
				? 1
				: offsetLeft - scrollBounds.left < 0
					? -1
					: 0;

		// 0: currently visible, 1: below viewport, -1: above viewport
		yDir = (offsetTop >= scrollBounds.top && offsetTop + offsetHeight <= scrollBounds.top + scrollBounds.clientHeight)
			? 0
			: offsetTop - scrollBounds.top > 0
				? 1
				: offsetTop - scrollBounds.top < 0
					? -1
					: 0;

		switch (xDir) {
		case 0:
			x = this.scrollLeft;
			break;
		case 1:
			// If control requested to be scrolled all the way to the viewport's left, or if the control
			// is larger than the viewport, scroll to the control's left edge. Otherwise, scroll just
			// far enough to get the control into view.
			if (inScrollFullPage || offsetWidth > scrollBounds.clientWidth) {
				x = offsetLeft;
			} else {
				x = offsetLeft - scrollBounds.clientWidth + offsetWidth;
				// If nodeStyle exists, add the _marginRight_ to the scroll value.
				x += enyo.dom.getComputedBoxValue(inControl.hasNode(), "margin", "right");
			}
			break;
		case -1:
			// If control requested to be scrolled all the way to the viewport's right, or if the control
			// is larger than the viewport, scroll to the control's right edge. Otherwise, scroll just
			// far enough to get the control into view.
			if (inScrollFullPage || offsetWidth > scrollBounds.clientWidth) {
				x = offsetLeft - scrollBounds.clientWidth + offsetWidth;
			} else {
				x = offsetLeft;
				// If nodeStyle exists, subtract the _marginLeft_ to the scroll value.
				x -= enyo.dom.getComputedBoxValue(inControl.hasNode(), "margin", "left");
			}
			break;
		}

		switch (yDir) {
		case 0:
			y = this.scrollTop;
			break;
		case 1:
			// If control requested to be scrolled all the way to the viewport's top, or if the control
			// is larger than the viewport, scroll to the control's top edge. Otherwise, scroll just
			// far enough to get the control into view.
			if (inScrollFullPage || offsetHeight > scrollBounds.clientHeight) {
				y = offsetTop;
				// If nodeStyle exists, add the _marginBottom_ to the scroll value.
				y -= enyo.dom.getComputedBoxValue(inControl.hasNode(), "margin", "top");
			} else {
				y = offsetTop - scrollBounds.clientHeight + offsetHeight;
				// If nodeStyle exists, add the _marginBottom_ to the scroll value.
				y += enyo.dom.getComputedBoxValue(inControl.hasNode(), "margin", "bottom");
			}
			break;
		case -1:
			// If control requested to be scrolled all the way to the viewport's bottom, or if the control
			// is larger than the viewport, scroll to the control's bottom edge. Otherwise, scroll just
			// far enough to get the control into view.
			if (inScrollFullPage || offsetHeight > scrollBounds.clientHeight) {
				y = offsetTop - scrollBounds.clientHeight + offsetHeight;
			} else {
				y = offsetTop;
				// If nodeStyle exists, subtract the _marginTop_ to the scroll value.
				y -= enyo.dom.getComputedBoxValue(inControl.hasNode(), "margin", "bottom");
			}
			break;
		}
		
		this.setTimingFunction("scroll");
		this._scrollTo(x, y, null, false, true);
	},
	calcCurrentPosition: function() {
		var style = enyo.dom.getComputedStyleValue(this.calcScrollNode(), this.transformProp).split("(")[1].split(")")[0],
			x = -1 * style.split(",")[4],
			y = -1 * style.split(",")[5];
		
		return {x: x, y: y};
	},
	calcDuration: function(inX, inY, inDuration) {
		var delta = Math.max(Math.abs(this.scrollLeft - inX), Math.abs(this.scrollTop - inY)),
			duration = 1000 * delta / this.scrollSpeed;
		
		return (inDuration >= 0 && inDuration < duration) ? inDuration : this.clampDuration(delta, duration);
	},
	clampDuration: function(inDistance, inDuration) {
		var speed = Math.min(1000 * inDistance / inDuration, this.maxScrollSpeed);
		return 1000 * inDistance / speed;
	},
	clampScrollSpeed: function(inSpeed) {
		if (inSpeed > this.maxScrollSpeed) {
			this.maxSpeedReached = true;
			inSpeed = this.maxScrollSpeed;
		}
		
		return inSpeed;
	},
	calcScrollSpeed: function(inFrom, inTo, inDuration) {
		var delta = Math.abs(inFrom - inTo);
		return this.clampScrollSpeed((inDuration) ? delta * 1000 / inDuration : this.scrollSpeed);
	},
	clampX: function(inX) {
		var delta;
		if (inX > this.rightBoundary) {
			delta = Math.abs(inX - this.rightBoundary);
			inX = this.rightBoundary + Math.min(Math.pow(delta, 1/1.25), this.maxOverscrollDistance);
		} else if (inX < this.leftBoundary) {
			delta =  Math.abs(inX - this.leftBoundary);
			inX = this.leftBoundary - Math.min(Math.pow(delta, 1/1.25), this.maxOverscrollDistance);
		}
		return inX;
	},
	clampY: function(inY) {
		var delta;
		if (inY > this.bottomBoundary) {
			delta = Math.abs(inY - this.bottomBoundary);
			inY = this.bottomBoundary + Math.min(Math.pow(delta, 1/1.25), this.maxOverscrollDistance);
		} else if (inY < this.topBoundary) {
			delta =  Math.abs(inY - this.topBoundary);
			inY = this.topBoundary - Math.min(Math.pow(delta, 1/1.25), this.maxOverscrollDistance);
		}
		return inY;
	},
	calcScrollNode: function() {
		return this.$.client.hasNode();
	},
	muteSpotlight: function() {
		if (!enyo.Spotlight.isMuted()) {
			enyo.Spotlight.unspot();
			enyo.Spotlight.mute(this);
		}
	},
	unmuteSpotlight: function() {
		enyo.Spotlight.unmute(this);
	},
	
	// Thumb processing
	
	//* Syncs and shows both the vertical and horizontal scroll indicators.
	showThumbs: function(inDuration) {
		if (this.showHorizontal()) {
			this.$.hthumb.sync(this, inDuration);
			this.$.hthumb.show();
		}
		if (this.showVertical()) {
			this.$.vthumb.sync(this, inDuration);
			this.$.vthumb.show();
		}
	},
	//* Hides the vertical and horizontal scroll indicators asynchronously.
	delayHideThumbs: function(inDelay) {
		if (this.showHorizontal()) {
			this.$.hthumb.delayHide(inDelay);
		}
		if (this.showVertical()) {
			this.$.vthumb.delayHide(inDelay);
		}
	},
	//* Move thumbs by 1px to force the css to update
	twiddleThumbs: function() {
		if (this.showHorizontal()) {
			this.$.hthumb.twiddle();
		}
		if (this.showVertical()) {
			this.$.vthumb.twiddle();
		}
	}
});
