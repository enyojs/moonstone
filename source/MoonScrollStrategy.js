/**
	_moon.ScrollStrategy_ inherits from
	<a href="#enyo.TouchScrollStrategy">enyo.TouchScrollStrategy</a>. Its main
	purpose is to handle scroller paging for
	<a href="#moon.Scroller">moon.Scroller</a> and
	<a href="#moon.List">moon.List</a>.
*/

enyo.kind({
	name: "moon.ScrollStrategy",
	kind: "enyo.TouchScrollStrategy",
	published: {
		//* Increase this value to increase the distance scrolled by the scroll wheel
		scrollWheelMultiplier: 5,
		//* Increase this value to increase the distance scrolled by tapping the pagination buttons
		paginationPageMultiplier: 1,
		//* Increase this value to increase the distance scrolled by holding the pagination buttons
		paginationScrollMultiplier: 5
	},
	handlers: {
		onRequestScrollIntoView : "requestScrollIntoView",
		onenter                 : "enter",
		onleave                 : "leave"
	},
	//* @protected
	tools: [
		{kind: "ScrollMath", onScrollStart: "scrollMathStart", onScroll: "scrollMathScroll", onScrollStop: "scrollMathStop"}
	],
	components: [
		{name: "clientContainer", classes: "moon-scroller-client-wrapper", components: [
			{name: "viewport", classes:"moon-scroller-viewport", components: [
				{name: "client", classes: "enyo-touch-scroller matrix-scroll-client matrix3dsurface"}
			]}
		]},
		{name: "vColumn", classes: "moon-scroller-v-column", components: [
			{name: "pageUpControl", kind: "moon.PagingControl", classes: "hidden", side: "top", onPaginateScroll: "paginateScroll", onPaginate: "paginate"},
			{name: "vthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-vthumb-container", components: [
				{name: "vthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-vthumb hidden", axis: "v"}
			]},
			{name: "pageDownControl", kind: "moon.PagingControl", classes: "hidden", side: "bottom", onPaginateScroll: "paginateScroll", onPaginate: "paginate"}
		]},
		{name: "hColumn", classes: "moon-scroller-h-column", components: [
			{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", onPaginateScroll: "paginateScroll", onPaginate: "paginate"},
			{name: "hthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-hthumb-container", components: [
				{name: "hthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-hthumb hidden", axis: "h"}
			]},
			{name: "pageRightControl", kind: "moon.PagingControl", side: "right", onPaginateScroll: "paginateScroll", onPaginate: "paginate"}
		]},
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged", isChrome: true}
	],
	create: function() {
		this.inherited(arguments);
		this.transform = enyo.dom.canTransform();
		this.accel = enyo.dom.canAccelerate();
		this.container.addClass("enyo-touch-strategy-container");
		this.translation = this.accel ? "matrix3d" : "matrix";
	},
	/**
		Calls super-super-inherited (i.e., skips _TouchScrollStrategy_'s)
		_rendered()_ function to avoid thumb flicker at render time. Then
		shows or hides page controls.
	*/
	rendered: function() {
		enyo.TouchScrollStrategy.prototype.rendered._inherited.apply(this, arguments);
		this.setupBounds();
		this.updateSpotlightPagingControls();
	},
	resizeHandler: function() {
		this.setupBounds();
	},
	setupBounds: function() {
		this.calcBoundaries();
		this.syncScrollMath();
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
	},

	//* @public
	//* Gets the left scroll position within the scroller.
	getScrollLeft: function() {
		return this.scrollLeft;
	},
	//* Gets the top scroll position within the scroller.
	getScrollTop: function() {
		return this.scrollTop;
	},
	//* Sets the top scroll position within the scroller.
	setScrollLeft: function(inLeft) {
		var m = this.$.scrollMath;
		m.setScrollX(-inLeft);
		m.stabilize();
	},
	//* Sets the top scroll position within the scroller.
	setScrollTop: function(inTop) {
		var m = this.$.scrollMath;
		m.setScrollY(-inTop);
		m.stabilize();
	},
	//* Scrolls to specific x/y positions within the scroll area.
	scrollTo: function(inX, inY) {
		this._scrollTo(inX, inY);
	},

	//* @protected

	//* Overrides default _maxHeightChanged()_ method from _TouchScrollStrategy_.
	maxHeightChanged: function() {
		// content should cover scroller at a minimum if there's no max-height.
		this.$.client.applyStyle("min-height", this.maxHeight ? null : "100%");
		this.$.client.applyStyle("max-height", this.maxHeight);
		this.$.clientContainer.addRemoveClass("enyo-scrollee-fit", !this.maxHeight);
	},

	// Event handling

	//* Disables dragging.
	shouldDrag: function(inSender, inEvent) { return true; },
	//* On _hold_, stops scrolling.
	hold: function(inSender, inEvent) {
		if (!this.isPageControl(inEvent.originator)) {
			this.inherited(arguments);
		}
	},
	//* On _down_, stops scrolling.
	down: function(inSender, inEvent) {
		if (!this.isPageControl(inEvent.originator) && this.isScrolling() && !this.isOverscrolling()) {
			this.stop();
		}
	},
	//* On _mousewheel_, scrolls a fixed amount.
	mousewheel: function(inSender, inEvent) {
		var x = null,
			y = null,
			delta = 0,
			showVertical = this.showVertical(),
			showHorizontal = this.showHorizontal()
		;
		
		//* If we don't have to scroll, allow mousewheel event to bubble
		if (!showVertical && !showHorizontal) {
			return false;
		}

		if (showVertical) {
			y = this.scrollTop + -1 * (inEvent.wheelDeltaY * this.scrollWheelMultiplier);
		}

		if (showHorizontal) {
			delta = (!inEvent.wheelDeltaX) ? inEvent.wheelDeltaY : inEvent.wheelDeltaX;
			x = this.scrollLeft + -1 * (delta * this.scrollWheelMultiplier);
		}

		this.scrollTo(x, y);
		inEvent.preventDefault();
		return true;
	},
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
		var scrollDelta = this.getScrollBounds().clientHeight * this.paginationPageMultiplier,
			side = inEvent.originator.side,
			x = this.getScrollLeft(),
			y = this.getScrollTop()
		;

		switch (side) {
		case "left":
			x -= scrollDelta;
			break;
		case "top":
			y -= scrollDelta;
			break;
		case "right":
			x += scrollDelta;
			break;
		case "bottom":
			y += scrollDelta;
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
			// When we hit the left, bounce and end scrolling
			if (val <= -this.$.scrollMath.leftBoundary) {
				this.setScrollLeft(-this.$.scrollMath.leftBoundary);
				this.$.pageLeftControl.hitBoundary();
			} else {
				this.setScrollLeft(val);
			}
			break;
		case "top":
			val = this.scrollTop - delta;
			// When we hit the top, bounce and end scrolling
			if (val <= -this.$.scrollMath.topBoundary) {
				this.setScrollTop(-this.$.scrollMath.topBoundary);
				this.$.pageUpControl.hitBoundary();
			} else {
				this.setScrollTop(val);
			}
			break;
		case "right":
			val = this.scrollLeft + delta;
			// When we hit the right, bounce and end scrolling
			if (val >= -this.$.scrollMath.rightBoundary) {
				this.setScrollLeft(-this.$.scrollMath.rightBoundary);
				this.$.pageRightControl.hitBoundary();
			} else {
				this.setScrollLeft(val);
			}

			break;
		case "bottom":
			val = this.scrollTop + delta;
			// When we hit the bottom, bounce and end scrolling
			if (val >= -this.$.scrollMath.bottomBoundary) {
				this.setScrollTop(-this.$.scrollMath.bottomBoundary);
				this.$.pageDownControl.hitBoundary();
			} else {
				this.setScrollTop(val);
			}
			break;
		}

		return true;
	},
	scrollMathScroll: function() {
		this.inherited(arguments);

		if (this.hovering) {
			this.showHidePageControls();
		} else {
			this.hidePageControls();
		}

		this.showHideScrollColumns(true);
	},




	//* Scrolls to specific x/y positions within the scroll area.
	_scrollTo: function(inX, inY) {
		this.$.scrollMath.scrollTo(inX, inY);
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
			?   "1,         0,     0,  0, "
			+	"0,         1,     0,  0, "
			+	"0,         0,     1,  0, "
			+    x + ", " + y + ", 1,  1"

			:   "1, 0, 0, 1, " + x + ", " + y
		;
	},
	effectScrollStop: function() { },
	effectOverscroll: function() { },


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
		captures the difference for use in thumb rendering math.
	*/
	setThumbSizeRatio: function() {
		var scrollBounds = this.getScrollBounds();
		this.$.vthumb.setSizeRatio(this.$.vthumbContainer.getBounds().height/scrollBounds.clientHeight);
		this.$.hthumb.setSizeRatio(this.$.hthumbContainer.getBounds().width/scrollBounds.clientWidth);
	},
	//* Responds to child components' requests to be scrolled into view.
	requestScrollIntoView: function(inSender, inEvent) {
		if (!enyo.Spotlight.getPointerMode()) {
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
	spotlightModeChanged: function(inSender, inEvent) {
		this.showHidePageControls();
	},
	//* Shows or hides pagination controls, as appropriate.
	showHidePageControls: function(inSender, inEvent) {
		/*
			If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			If not hovering and set to hide on leave, hide pagination controls.
		*/
		if (!this.shouldShowPageControls()) {
			this.hidePageControls();
			return;
		}

		var top = this.getScrollTop(),
			left = this.getScrollLeft(),
			m = this.$.scrollMath
		;

		this.$.pageUpControl.addRemoveClass("hidden", (top <= 0));
		this.$.pageDownControl.addRemoveClass("hidden", (top >= -1 * m.bottomBoundary));

		this.$.pageLeftControl.addRemoveClass("hidden", (left <= 0));
		this.$.pageRightControl.addRemoveClass("hidden", (left >= -1 * m.rightBoundary));
	},
	//* Enables or disables scroll columns.
	enableDisableScrollColumns: function() {
		this.enableDisableVerticalScrollControls(this.showVertical());
		this.enableDisableHorizontalScrollControls(this.showHorizontal());
	},
	//* Enables or disables vertical scroll column.
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
	//* Enables or disables horizontal scroll column.
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
	/**
		Returns boolean indicating whether page controls should be shown at all for
		this scroller.
	*/
	shouldShowPageControls: function() {
		return (enyo.Spotlight.getPointerMode() && this.hovering);
	},
	//* Determines whether we should be showing the vertical scroll column.
	showVertical: function() {
		return (this.getVertical() !== "hidden" && -1 * this.$.scrollMath.bottomBoundary > 0);
	},
	//* Determines whether we should be showing the horizontal scroll column.
	showHorizontal: function() {
		return (this.getHorizontal() !== "hidden" && -1 * this.$.scrollMath.rightBoundary > 0);
	},
	//* Hides pagination controls.
	hidePageControls: function() {
		this.$.pageLeftControl.addClass("hidden");
		this.$.pageRightControl.addClass("hidden");
		this.$.pageUpControl.addClass("hidden");
		this.$.pageDownControl.addClass("hidden");
	},
	_getScrollBounds: function() {
		var containerBounds = this.$.clientContainer.getBounds(),
			s = this.getScrollSize(),
			b = {
				top: this.getScrollTop(),
				left: this.getScrollLeft(),
				clientHeight: containerBounds.height,
				clientWidth: containerBounds.width,
				height: s.height,
				width: s.width
			}
		;

		b.maxLeft = Math.max(0, b.width - b.clientWidth);
		b.maxTop = Math.max(0, b.height - b.clientHeight);

		enyo.mixin(b, this.getOverScrollBounds());

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

		// If x or y changed, scroll to new position
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x, y);
		}
	}
});
