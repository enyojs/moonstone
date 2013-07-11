/**
	_enyo.TouchScrollStrategy_ is a helper kind for implementing a touch-based
	scroller. It integrates the scrolling simulation provided by
	<a href="#enyo.ScrollMath">enyo.ScrollMath</a> into an
	<a href="#enyo.Scroller">enyo.Scroller</a>.

	_enyo.TouchScrollStrategy_ is not typically created in application code.
	Instead, it is specified as the value of the `strategyKind` property of an
	`enyo.Scroller` or <a href="#enyo.List">enyo.List</a>, or is used by the
	framework implicitly.
*/
enyo.kind({
	name: "moon.ScrollStrategy",
	kind: "enyo.TouchScrollStrategy",
	published: {
		//* Vertical distance in px to travel each paging control button click
		vPageSize: 50,
		//* Horizontal distance in px to travel each paging control button click
		hPageSize: 50,
		//* Percentage of scroller client area to jump when paging (larger numbers yield faster scrolling)
		pageRatio: 0.7,
		//* Increase this value to increase the distance scrolled by the scroll wheel
		scrollWheelMultiplier: 5,
		//* Increase this value to increase the distance scrolled by tapping the pagination buttons
		paginationPageMultiplier: 10,
		//* Increase this value to increase the distance scrolled by holding the pagination buttons
		paginationScrollMultiplier: 5
	},
	//* @protected
	handlers: {
		onSpotlightFocused		: "spotFocused",
		onRequestScrollIntoView	: "requestScrollIntoView",
		onenter					: "enter",
		onleave					: "leave"
	},
	tools: [
		{kind: "ScrollMath", onScrollStart: "scrollMathStart", onScroll: "scrollMathScroll", onScrollStop: "scrollMathStop"}
	],
	components: [
		{name: "clientContainer", classes: "moon-scroller-client-wrapper", components: [
			{name: "client", classes: "enyo-touch-scroller matrix-scroll-client matrix3dsurface"}
		]},
		{name: "vColumn", classes: "moon-scroller-v-column", components: [
			{name: "pageUpControl", kind: "moon.PagingControl", classes: "hidden", side: "top", content: "<", onPaginateScroll: "paginateScroll", onPaginate: "paginate"},
			{name: "vthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-vthumb-container", components: [
				{name: "vthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-vthumb hidden", axis: "v"}
			]},
			{name: "pageDownControl", kind: "moon.PagingControl", classes: "hidden", side: "bottom", content: ">", onPaginateScroll: "paginateScroll", onPaginate: "paginate"}
		]},
		{name: "hColumn", classes: "moon-scroller-h-column", components: [
			{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", content: "<", onPaginateScroll: "paginateScroll", onPaginate: "paginate"},
			{name: "hthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-hthumb-container", components: [
				{name: "hthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-hthumb hidden", axis: "h"}
			]},
			{name: "pageRightControl", kind: "moon.PagingControl", side: "right", content: ">", onPaginateScroll: "paginateScroll", onPaginate: "paginate"}
		]},
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged", isChrome: true}
	],
	
	
	// flag telling us whether the list is currently reordering
	listReordering: false,
	create: function() {
		this.inherited(arguments);
		this.transform = enyo.dom.canTransform();
		this.accel = enyo.dom.canAccelerate();
		this.container.addClass("enyo-touch-strategy-container");
		this.translation = this.accel ? "matrix3d" : "matrix";
	},
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
	},
	rendered: function() {
		enyo.TouchScrollStrategy.prototype.rendered._inherited.apply(this, arguments);
		this.calcBoundaries();
		this.syncScrollMath();
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
		this.updatePageSize();
		this.updateSpotlightPagingControls();
	},
	//* Whether or not the scroller is actively moving
	isScrolling: function() {
		return this.$.scrollMath.isScrolling();
	},
	//* Whether or not the scroller is in overscrolling
	isOverscrolling: function() {
		return this.$.scrollMath.isInOverScroll();
	},
	stop: function() {
		this.$.scrollMath.stop(true);
	},
	//* Gets the left scroll position within the scroller.
	getScrollLeft: function() {
		return this.scrollLeft;
	},
	//* Gets the top scroll position within the scroller.
	getScrollTop: function() {
		return this.scrollTop;
	},
	//* Disable dragging
	shouldDrag: function(inSender, inEvent) { return true; },
	//* On hold, stop scrolling
	hold: function(inSender, inEvent) {
		if (!this.isPageControl(inEvent.originator)) {
			this.inherited(arguments);
		}
	},
	//* On down, stop scrolling
	down: function(inSender, inEvent) {
		if (!this.isPageControl(inEvent.originator) && this.isScrolling() && !this.isOverscrolling()) {
			this.stop();
		}
	},
	//* Return true if _inControl_ is one of four page controls
	isPageControl: function(inControl) {
		return (
			inControl === this.$.pageUpControl ||
			inControl === this.$.pageDownControl ||
			inControl === this.$.pageLeftControl ||
			inControl === this.$.pageRightControl
		);
	},
	//* OnMousewheel, scroll a fixed amount
	mousewheel: function(inSender, inEvent) {
		if (this.getVertical() !== "hidden") {
			var y = -1 * this.scrollTop + (inEvent.wheelDeltaY * this.scrollWheelMultiplier);
			this.scrollTo(null, y);
			
		} else if (this.getHorizontal() !== "hidden") {
			var x = -1 * this.scrollLeft + (inEvent.wheelDeltaY * this.scrollWheelMultiplier);
			this.scrollTo(x, null);
		}
		
		inEvent.preventDefault();
		return true;
	},
	enter: function() {
		this.hovering = true;
		this.showHidePageControls();
		this.showHideScrollColumns(true);
	},
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHideScrollColumns(false);
	},
	//* Handles _paginate_ event sent from PagingControl buttons.
	paginate: function(inSender, inEvent) {
		this.showHidePageControls();
		
		var scrollDelta = inEvent.scrollDelta * this.paginationPageMultiplier,
			side = inEvent.originator.side,
			x = -1 * this.getScrollLeft(),
			y = -1 * this.getScrollTop()
		;
		
		switch (side) {
			case "left":
				x += scrollDelta;
				break;
			case "top":
				y += scrollDelta;
				break;
			case "right":
				x -= scrollDelta;
				break;
			case "bottom":
				y -= scrollDelta;
				break;
		}
		
		this._scrollTo(x, y);
		
		return true;
	},
	//* Handles _paginateScroll_ event sent from PagingControl buttons.
	paginateScroll: function(inSender, inEvent) {
		if (!inEvent || !inEvent.scrollDelta) {
			return;
		}
		
		var delta = inEvent.scrollDelta * this.paginationScrollMultiplier,
			side = inEvent.originator.side,
			val
		;
		
		switch (side) {
			case "left":
				val = this.scrollLeft - delta;
				this.setScrollLeft(val);
				
				// When we hit the left, bounce and end scrolling
				if (val <= -this.$.scrollMath.leftBoundary) {
					this.$.pageLeftControl.endHold();
				}
				break;
			case "top":
				val = this.scrollTop - delta;
				this.setScrollTop(val);
				
				// When we hit the top, bounce and end scrolling
				if (val <= -this.$.scrollMath.topBoundary) {
					this.$.pageUpControl.endHold();
				}
				break;
			case "right":
				val = this.scrollLeft + delta;
				this.setScrollLeft(val);
				
				// When we hit the right, bounce and end scrolling
				if (val >= -this.$.scrollMath.rightBoundary) {
					this.$.pageRightControl.endHold();
				}
				break;
			case "bottom":
				val = this.scrollTop + delta;
				this.setScrollTop(val);
				
				// When we hit the bottom, bounce and end scrolling
				if (val >= -this.$.scrollMath.bottomBoundary) {
					this.$.pageDownControl.endHold();
				}
				break;
		}
		
		return true;
	},
	//* Scrolls to specific x/y positions within the scroll area.
	scrollTo: function(inX, inY) {
		this.stop();
		this._scrollTo(inX, inY);
	},
	_scrollTo: function(inX, inY) {
		inX = (inX) ? -1 * inX : null;
		inY = (inY) ? -1 * inY : null;
		this.$.scrollMath.scrollTo(inX, inY);
	},
	setScrollTop: function(inTop) {
		var m = this.$.scrollMath;
		m.setScrollY(-inTop);
		m.stabilize();
	},
	setScrollLeft: function(inLeft) {
		var m = this.$.scrollMath;
		m.setScrollX(-inLeft);
		m.stabilize();
	},
	calcBoundaries: function() {
		var s = this.$.scrollMath || this,
			b = this._getScrollBounds()
		;
		s.bottomBoundary = -1 * b.maxTop;
		s.rightBoundary = -1 * b.maxLeft;
	},
	effectScroll: function(inX, inY) {
		this.scrollLeft = inX || this.scrollLeft || 0;
		this.scrollTop =  inY || this.scrollTop  || 0;
		enyo.dom.transformValue(this.$.client, this.translation, this.generateMatrix());
	},
	generateMatrix: function() {
		var x = -1 * this.scrollLeft,
			y = -1 * this.scrollTop
		;
		
		return (this.accel)
			? 	"1, 	    0, 	   0,  0, " +
				"0, 	    1, 	   0,  0, " + 
				"0, 	    0, 	   1,  0, " +
				 x + ", " + y + ", 1,  1"
			
			: 	"1, 0, 0, 1, " + x + ", " + y
		;
	},
	effectScrollStop: function() {},
	effectOverscroll: function() {},
	
	
	
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
		Because the thumb columns are a fixed size that impacts the scrollbounds, capture
		the differenceand use in thumb rendering math.
	*/
	setThumbSizeRatio: function() {
		var scrollBounds = this.getScrollBounds();
		this.$.vthumb.setSizeRatio(this.$.vthumbContainer.getBounds().height/scrollBounds.clientHeight);
		this.$.hthumb.setSizeRatio(this.$.hthumbContainer.getBounds().width/scrollBounds.clientWidth);
	},
	updatePageSize: function() {
		var sb = this.getScrollBounds();
		if (this.getVertical() !== "hidden") {
			this.setVPageSize(sb.clientHeight * this.pageRatio);
		}
		if (this.getHorizontal() !== "hidden") {
			this.setHPageSize(sb.clientWidth * this.pageRatio);
		}
	},
	//* Responds to child components' requests to be scrolled into view.
	requestScrollIntoView: function(inSender, inEvent) {
		if (!enyo.Spotlight.getPointerMode()) {
			this.animateToControl(inEvent.originator, inEvent.scrollFullPage);
		}
		return true;
	},
	//* Scrolls a child component into view if it bubbles an _onSpotlightFocused_
	//* event (and it is not already in view).
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			return;
		}
		
		if ((!this.isInView(inEvent.originator.hasNode())) && (!enyo.Spotlight.getPointerMode())) {
			this.animateToControl(inEvent.originator);
		}
	},
	spotlightModeChanged: function(inSender, inEvent) {
		this.showHidePageControls();
	},
	//* Shows/hides pagination controls as appropriate.
	showHidePageControls: function(inSender, inEvent) {
		/*
			If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			If not hovering and set to hide on leave, hide pagination controls.
		*/
		if (!this.shouldShowPageControls()) {
			this.hidePageControls();
			return;
		}
		
		var sb = this._getScrollBounds(),
			top = this.getScrollTop(),
			left = this.getScrollLeft()
		;
		
		this.$.pageUpControl.addRemoveClass("hidden", (top <= 0));
		this.$.pageDownControl.addRemoveClass("hidden", (top >= sb.maxTop));
		
		this.$.pageLeftControl.addRemoveClass("hidden", (left <= 0));
		this.$.pageRightControl.addRemoveClass("hidden", (left >= sb.maxLeft));
	},
	//* Enable/disable scroll columns
	enableDisableScrollColumns: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		this.enableDisableVerticalScrollControls(this.showVertical(inScrollBounds));
		this.enableDisableHorizontalScrollControls(this.showHorizontal(inScrollBounds));
	},
	//* Enable/disable vertical scroll column
	enableDisableVerticalScrollControls: function(inEnabled) {
		if (inEnabled) {
			this.$.clientContainer.addClass("v-scroll-enabled");
			this.$.vColumn.addClass("v-scroll-enabled");
			this.$.hColumn.addClass("v-scroll-enabled");
		} else {
			this.$.clientContainer.removeClass("v-scroll-enabled");
			this.$.vColumn.removeClass("v-scroll-enabled");
			this.$.hColumn.removeClass("v-scroll-enabled");
		}
	},
	//* Enable/disable horizontal scroll column
	enableDisableHorizontalScrollControls: function(inEnabled) {
		if (inEnabled) {
			this.$.clientContainer.addClass("h-scroll-enabled");
			this.$.vColumn.addClass("h-scroll-enabled");
			this.$.hColumn.addClass("h-scroll-enabled");
		} else {
			this.$.clientContainer.removeClass("h-scroll-enabled");
			this.$.vColumn.removeClass("h-scroll-enabled");
			this.$.hColumn.removeClass("h-scroll-enabled");
		}
	},
	//* Show/hide scroll columns
	showHideScrollColumns: function(inShow) {
		this.showHideVerticalScrollColumns(inShow);
		this.showHideHorizontalScrollColumns(inShow);
	},
	//* Show/hide vertical scroll column
	showHideVerticalScrollColumns: function(inShow) {
		this.$.vColumn.addRemoveClass("visible", inShow);
	},
	//* Show/hide horizontal scroll column
	showHideHorizontalScrollColumns: function(inShow) {
		this.$.hColumn.addRemoveClass("visible", inShow);
	},
	//* Return whether page controls should be shown at all for this scroller
	shouldShowPageControls: function() {
		return true;
		return (enyo.Spotlight.getPointerMode() && this.hovering);
	},
	//* Determine if we should be showing the vertical scroll column
	showVertical: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		return (this.getVertical()   !== "hidden" && inScrollBounds.maxTop > 0);
	},
	//* Determine if we should be showing the horizontal scroll column
	showHorizontal: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		return (this.getHorizontal() !== "hidden" && inScrollBounds.maxLeft > 0);
	},
	//* Hides pagination controls.
	hidePageControls: function() {
		this.$.pageLeftControl.addClass("hidden");
		this.$.pageRightControl.addClass("hidden");
		this.$.pageUpControl.addClass("hidden");
		this.$.pageDownControl.addClass("hidden");
	},
	_getScrollBounds: function() {
		var b = this.inherited(arguments),
			clientNode = this.$.client.hasNode(),
			containerBounds = this.$.clientContainer.getBounds()
		;
		b.clientWidth = containerBounds.width;
		b.clientHeight = containerBounds.height;
		b.width = clientNode ? clientNode.clientWidth : 0;
		b.height = clientNode ? clientNode.clientHeight : 0;
		return b;
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
			x = this.getScrollLeft();
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
			y = this.getScrollTop();
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
		
		// Make sure we have our thumbs visible
		this.showHidePageControls();
		this.showHideScrollColumns(true);

		// If x or y changed, scroll to new position
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(-x, -y);
		}
	},
	
	
	
	// Thumb processing
	alertThumbs: function() {
		this.showThumbs();
		this.delayHideThumbs(500);
	},
	//* Syncs the vertical and horizontal scroll indicators.
	syncThumbs: function() {
		 this.$.vthumb.sync(this);
		 this.$.hthumb.sync(this);
	},
	updateThumbs: function() {
		this.$.vthumb.update(this);
		this.$.hthumb.update(this);
	},
	//* Syncs and shows both the vertical and horizontal scroll indicators.
	showThumbs: function() {
		this.syncThumbs();
		if (this.horizontal != "hidden") {
			this.$.hthumb.show();
		}
		if (this.vertical != "hidden") {
			this.$.vthumb.show();
		}
	},
	//* Hides the vertical and horizontal scroll indicators.
	hideThumbs: function() {
		 this.$.vthumb.hide();
		 this.$.hthumb.hide();
	},
	//* Hides the vertical and horizontal scroll indicators asynchronously.
	delayHideThumbs: function(inDelay) {
		 this.$.vthumb.delayHide(inDelay);
		 this.$.hthumb.delayHide(inDelay);
	}
});
