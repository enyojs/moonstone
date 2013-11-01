/**
	_moon.ScrollStrategy_ inherits from
	<a href="#enyo.TouchScrollStrategy">enyo.TouchScrollStrategy</a>. Its main
	purpose is to handle scroller paging for
	<a href="#moon.Scroller">moon.Scroller</a> and
	<a href="#moon.List">moon.List</a>.
*/

enyo.kind({
	name: "enyo._TransitionScrollStrategy",
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
		onmousewheel: "mousewheel"
	},
	components: [
		{name: "clientContainer", classes: "moon-scroller-client-wrapper", components: [
			{name: "viewport", classes:"moon-scroller-viewport", components: [
				{name: "client", classes: "enyo-touch-scroller matrix-scroll-client matrix3dsurface moon-scroll-client", ontransitionend: "transitionEnd"}
			]}
		]},
		{name: "vColumn", classes: "transition-strategy-thumb-container vertical", components: [
			{name: "vthumb", kind: "enyo.TransitionThumb", classes: "vertical hidden", axis: "v"}
		]},
		{name: "hColumn", classes: "transition-strategy-thumb-container horizontal", components: [
			{name: "hthumb", kind: "enyo.TransitionThumb", classes: "horizontal hidden", axis: "h"}
		]}
	],
	//* Bezier timing functions used for different scroll behaviors
	timingFunctions: {
		scroll: {
			controlPoints: [0.25,0.1,0.25,1],
			points: []
		},
		scrollIntoView: {
			controlPoints: [0.25,0.1,0.25,1],
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
	//* Current bezier timing function
	timingFunction: null,
	//* Larger numbers -> faster mousewheel scrolling
	mouseWheelMultiplier: 4,
	//* Duration of mousewheel scroll animations
	mousewheelDurationMS: 400,
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
	//* X overscroll buffer defined as a fraction of the scroller width
	overscrollRatioX: 0.2,
	//* X overscroll buffer in pixels
	overscrollBufferX: 200,
	//* Y overscroll buffer defined as a fraction of the scroller height
	overscrollRatioY: 0.2,
	//* Y overscroll buffer in pixels
	overscrollBufferY: 200,
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
		this.translateProp = this.accel ? "translate3d" : "translate";
		this.container.addClass("enyo-touch-strategy-container");
		this.timingFunctionsChanged();
		this.setTimingFunction("scroll");
	},
	rendered: function() {
		this.inherited(arguments);
		// Have to delay calculating boundaries here or the bounds are intermittently incorrect
		setTimeout(enyo.bind(this, function() {
			this.calcBoundaries();
			this.effectScrollStop();
			this.updateThumbs();
		}), 50);
	},
	resizeHandler: function() {
		this.calcBoundaries();
	},
	horizontalChanged: function() { },
	verticalChanged: function() { },
	//* Override _maxHeightChanged()_. Content should cover scroller at a minimum if there's no max-height.
	maxHeightChanged: function() {
		this.$.client.applyStyle("min-height", this.maxHeight ? null : "100%");
		this.$.client.applyStyle("max-height", this.maxHeight);
		this.$.clientContainer.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
	},
	timingFunctionsChanged: function() {
		for (var func in this.timingFunctions) {
			this.timingFunctions[func].points = this.calcBezierPoints(this.timingFunctions[func].controlPoints);
		}
	},

	//* @public
	
	//* Sets the top scroll position within the scroller without animation.
	setScrollLeft: function(inLeft) {
		this.directScrollTo(inLeft, this.scrollTop);
	},
	//* Sets the top scroll position within the scroller without animation.
	setScrollTop: function(inTop) {
		this.directScrollTo(this.scrollLeft, inTop);
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
	stop: function() {
		this.stabilize();
		this.delayHideThumbs(500);
		this._stop(true);

		if (!this.scrollListenerCallback) {
			this.doScroll();
		}

		this.doScrollStop();
		this.scrolling = false;
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

	//* On _mousewheel_, scrolls a fixed amount.
	mousewheel: function(inSender, inEvent) {
		this.refreshCachedScrollBounds();
		
		var x = 0, y = 0, dx = 0, dy = 0,
			delta = inEvent.wheelDelta || 0,
			vertical = this.showVertical(),
			horizontal = this.showHorizontal();
		
		// If we don't have to scroll, allow mousewheel event to bubble
		if (this.overscrolling || (!vertical && !horizontal)) {
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
		
		// If we receive mousewheel events that look to originate from a trackpad, move to trackpad scrolling
		if (this.trackpadScrolling(inEvent)) {
			this.trackpadMousewheel(dx, dy);
		} else {
			this.standardMousewheel(dx, dy);
		}
		
		inEvent.preventDefault();
		return true;
	},
	//* Called when css scroll transition completes
	transitionEnd: function(inSender, inEvent) {
		if (inEvent.originator === this.$.client) {
			this.refreshCachedScrollBounds();
			this.checkBounceBack();
			return true;
		}
	},
	checkBounceBack: function() {
		if (this.isInOverscroll(true)) {
			this.bounceBack();
		} else {
			this.stop();
		}
	},
	
	
	///////// End Event Handlers /////////
	

	//* Scrolls to specific x/y positions within the scroll area without animation.
	directScrollTo: function(inX, inY) {
		this.refreshCachedScrollBounds();
		
		if (this.scrolling) {
			this.stop();
		}
		
		this.updateScrollValues(inX, inY, 0);
		this.scrollLeft = inX;
		this.scrollTop  = inY;
		this.sendScrollEvent();
		this.updateThumbs();
		this.effectScrollStop();
 		this.resetScrollValues();
	},
	//* Scrolls to specific x/y positions within the scroll area.
	_scrollTo: function(inX, inY, inDuration) {
		inX = this.clampX(inX);
		inY = this.clampY(inY);
		inDuration = this.clampDuration(inX, inY, inDuration);
		
		// Only scroll to new positions
		if (inX === this.scrollLeft && inY === this.scrollTop) {
			return;
		}
		
		// Go scroll
		this.startScrolling(inX, inY, inDuration);
	},
	startScrolling: function(inX, inY, inDuration) {
		this.updateScrollValues(inX, inY, inDuration);
		this.effectScroll(inX, inY, inDuration);
		this.start();
	},
	start: function() {
		if (!this.scrolling) {
			this.doScrollStart();
		}

		this.scrolling = true;
		this.scroll();
	},
	//* Special handling for trackpads - no transition
	trackpadMousewheel: function(inDX, inDY) {
		var bounds = this.getScrollBounds(true),
			x = bounds.left - inDX,
			y = bounds.top - inDY;
		
		this.updateScrollValues(x, y, 0);
		this.setScrollLeft(x);
		this.setScrollTop(y);
		this.checkBounceBack();
 		this.resetScrollValues();
	},
	//* Mousewheel transition scrolling
	standardMousewheel: function(inDX, inDY) {
		var bounds = this.getScrollBounds(true),
			x = bounds.left - (inDX * this.mouseWheelMultiplier),
			y = bounds.top  - (inDY * this.mouseWheelMultiplier);
	
		if (this.scrolling) {
			this.stabilize();
			this.twiddleThumbs();
			this._stop(true);
		}
	
		this.setTimingFunction("mousewheel");
		this._scrollTo(x, y, this.mousewheelDurationMS);
	},
	//* _scroll()_ is called on a loop during transitions. Calculate position and send event as appropriate.
	scroll: function() {
		var timeElapsed = enyo.bench() - this.scrollStartTime;
		
		// Stop bubbling scroll events if we've passed total allotted scroll time
		if (timeElapsed > this.scrollDuration) {
			this.refreshCachedScrollBounds();
			this.checkBounceBack();
			return;
		}
		
		this.syncScrollPosition(timeElapsed);
		this.sendScrollEvent();
		
		// Kickoff next scroll() call
		this.startScrollJob();
	},
	_stop: function(inNoSync) {
		this.endScrollJob();
		this.resetScrollValues();

		if (!inNoSync) {
			this.syncScrollPosition();
		}
	},
	//* Bounce back from an overscroll area
	bounceBack: function() {
		var bounds = this.getScrollBounds(true),
			x = (bounds.left < bounds.minLeft) ? bounds.minLeft :
				(bounds.left > bounds.maxLeft) ? bounds.maxLeft :
				bounds.left,
			y = (bounds.top < bounds.minTop) ? bounds.minTop :
				(bounds.top > bounds.maxTop) ? bounds.maxTop :
				bounds.top;

		this.setTimingFunction("overscroll");
		this.startScrolling(x, y, this.overscrollDurationMS);
		this.overscrolling = true;
	},
	//* If a listener is set, check threshold, otherwise bubble scroll event
	sendScrollEvent: function() {
		if (this.scrollListenerCallback) {
			this.checkScrollThreshold();
		} else {
			this.doScroll();
		}
	},
	//* If we've crossed the scroll thresholds, call _this.scrollListenerCallback_
	checkScrollThreshold: function() {
		if (this.yDir === -1 && this.scrollTop  < this.scrollThreshold.top ||
			this.yDir ===  1 && this.scrollTop  > this.scrollThreshold.bottom ||
			this.xDir === -1 && this.scrollLeft < this.scrollThreshold.left ||
			this.xDir ===  1 && this.scrollLeft > this.scrollThreshold.right
		) {
			this.scrollListenerCallback(this.getScrollBounds());
		}
	},
	//* Kick off next iteration of _scroll()_
	startScrollJob: function() {
		this.startJob("scroll", "scroll", this.scrollBubbleIntervalMS);
	},
	//* Halt _scroll()_ loop
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
	//* Determine if user is using a trackpad and cache the result (assumption that it won't change during user session)
	trackpadScrolling: function(inEvent) {
		this._trackpadScrolling = this._trackpadScrolling || this.figureTrackpadScrolling(inEvent);
		return this._trackpadScrolling;
	},
	//* User is using a trackpad if: 1) Both x and y deltas are given in event. 2) Delta in event is less than 20px.
	figureTrackpadScrolling: function(inEvent) {
		return ((inEvent.wheelDeltaX !== 0 && inEvent.wheelDeltaY !== 0) || Math.abs(inEvent.wheelDelta) < 20);
	},
	//* Return true if currently in overscroll area (x or y)
	isInOverscroll: function(inUseCachedBounds) {
		return this.isInOverscrollX(null, inUseCachedBounds) || this.isInOverscrollY(null, inUseCachedBounds);
	},
	//* Return true if currently in overscroll x area
	isInOverscrollX: function(inX, inUseCachedBounds) {
		var bounds = this.getScrollBounds(inUseCachedBounds);
		inX = inX || bounds.left;
		return inX < bounds.minLeft || inX > bounds.maxLeft;
	},
	//* Return true if currently in overscroll y area
	isInOverscrollY: function(inY, inUseCachedBounds) {
		var bounds = this.getScrollBounds(inUseCachedBounds);
		inY = inY || bounds.top;
		return inY < bounds.minTop || inY > bounds.maxTop;
	},
	//* Update boundaries
	calcBoundaries: function() {
		var b = this.getScrollBounds();
		this.topBoundary = 0;
		this.leftBoundary = 0;
		this.bottomBoundary = b.maxTop;
		this.rightBoundary = b.maxLeft;
		this.updateOverscrollBounds();
	},
	//* Update buffer space allowed for overscrolling
	updateOverscrollBounds: function() {
		var containerBounds = this.getContainerBounds();
		this.overscrollBufferX = containerBounds.width  * this.overscrollRatioX;
		this.overscrollBufferY = containerBounds.height * this.overscrollRatioY;
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
		this.overscrolling = false;
	},
	resetScrollValues: function() {
		this.scrollDuration = null;
		this.targetLeft = null;
		this.targetTop = null;
		this.initialLeft = null;
		this.initialTop = null;
		this.xDir = 0;
		this.yDir = 0;
		this.scrollStartTime = null;
		this.overscrolling = false;
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
		return this.transformProp + ": " + this.translateProp + "(" + -1 * inX + "px, " + -1 * inY + "px, 0); ";
	},
	//* Convert bezier points to css-compatible transition timing string
	generateTimingFunctionString: function() {
		return "cubic-bezier(" + this.timingFunction.controlPoints[0] + "," + this.timingFunction.controlPoints[1] + "," + this.timingFunction.controlPoints[2] + "," + this.timingFunction.controlPoints[3] + ")";
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
	},
	//* Enables or disables horizontal scroll column.
	enableDisableHorizontalScrollControls: function(inEnabled) {
		this.$.clientContainer.addRemoveClass("h-scroll-enabled", inEnabled);
		this.$.vColumn.addRemoveClass("h-scroll-enabled", inEnabled);
		this.$.hColumn.addRemoveClass("h-scroll-enabled", inEnabled);
	},
	//* Shows or hides scroll columns.
	showHideScrollColumns: function(inShow) {
		this.showHideVerticalScrollColumns(inShow);
		this.showHideHorizontalScrollColumns(inShow);
	},
	//* Shows or hides vertical scroll columns.
	showHideVerticalScrollColumns: function(inShow) {
		this.$.vColumn.addRemoveClass("visible", inShow);
	},
	//* Shows or hides horizontal scroll columns.
	showHideHorizontalScrollColumns: function(inShow) {
		this.$.hColumn.addRemoveClass("visible", inShow);
	},
	//* Determines whether we should be showing the vertical scroll column.
	showVertical: function() {
		return (this.getVertical() === "scroll" || (this.getVertical() !== "hidden" && this.bottomBoundary > 0));
	},
	//* Determines whether we should be showing the horizontal scroll column.
	showHorizontal: function() {
		return (this.getHorizontal() === "scroll" || (this.getHorizontal() !== "hidden" && this.rightBoundary > 0));
	},
	//* Update _this.scrollBounds_ with fresh copy of scrollbounds
	refreshCachedScrollBounds: function() {
		this.scrollBounds = this.getScrollBounds();
	},
	//* Calculate scroll bounds. Use previously cached bounds if _inUseCachedBounds_ is true.
	getScrollBounds: function(inUseCachedBounds) {
		if (inUseCachedBounds && this.scrollBounds) {
			return this.scrollBounds;
		}
		
		var containerBounds = this.getContainerBounds(),
			s = this.getScrollSize();
		
		return {
			top: this.scrollTop,
			left: this.scrollLeft,
			clientHeight: containerBounds.height,
			clientWidth: containerBounds.width,
			height: s.height,
			width: s.width,
			xDir: this.xDir,
			yDir: this.yDir,
			minLeft: 0,
			minTop: 0,
			maxLeft: Math.max(0, s.width  - containerBounds.width),
			maxTop:  Math.max(0, s.height - containerBounds.height)
		};
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
		
		x = this.clampX(x);
		y = this.clampY(y);
		
		// Only scroll to new positions
		if (x === this.scrollLeft && y === this.scrollTop) {
			return;
		}
		
		this.setTimingFunction("scrollIntoView");
		this.startScrolling(x, y, this.clampDuration(x, y));
	},
	calcCurrentPosition: function() {
		var style = enyo.dom.getComputedStyleValue(this.calcScrollNode(), this.transformProp).split("(")[1].split(")")[0],
			x = -1 * style.split(",")[4],
			y = -1 * style.split(",")[5];
			
		return {x: x, y: y};
	},
	//* Calculate the standard duration for moving to _inX_, _inY_ from current position, and clamp with _inMaxDuration_
	clampDuration: function(inX, inY, inMaxDuration) {
		var xDuration = this.calcDuration(this.scrollLeft, inX, this.scrollSpeed),
			yDuration = this.calcDuration(this.scrollTop,  inY, this.scrollSpeed),
			duration = Math.max(xDuration, yDuration);
		
		return inMaxDuration ? Math.min(duration, inMaxDuration) : duration;
	},
	//* inFrom (px), inTo (px), inSpeed (px/sec). Returns duration in px/sec.
	calcDuration: function(inFrom, inTo, inSpeed) {
		return 1000 * Math.abs(inFrom - inTo) / inSpeed;
	},
	//* Return _true_ if travelling to _inX_, _inY_ at _inDuration_ will cross _this.maxScrollSpeed_
	shouldThrottleSpeed: function(inX, inY, inDuration) {
		var xSpeed = this.calcSpeed(this.scrollLeft, inX, inDuration),
			ySpeed = this.calcSpeed(this.scrollTop,  inY, inDuration),
			speed = Math.max(xSpeed, ySpeed);
		
		return speed >= this.maxScrollSpeed;
	},
	//* inFrom (px), inTo (px), inDuration (secs). Returns speed in px/sec.
	calcSpeed: function(inFrom, inTo, inDuration) {
		return 1000 * Math.abs(inFrom - inTo) / inDuration;
	},
	clampX: function(inX) {
		var bounds = this.getScrollBounds(true),
			ceil = bounds.maxLeft + this.overscrollBufferX,
			floor = bounds.minLeft - this.overscrollBufferX;
		return Math.min(ceil, Math.max(floor, inX));
	},
	clampY: function(inY) {
		var bounds = this.getScrollBounds(true),
			ceil = bounds.maxTop + this.overscrollBufferY,
			floor = bounds.minTop - this.overscrollBufferY;
		return Math.min(ceil, Math.max(floor, inY));
	},
	calcScrollNode: function() {
		return this.$.client.hasNode();
	},
	
	// Thumb processing
	
	updateThumbs: function() {
		this.showThumbs();
		this.delayHideThumbs(500);
	},
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
