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
		/**
			Vertical distance (in pixels) to travel for each click of the paging
			control button
		*/
		vPageSize: 50,
		/**
			Horizontal distance (in pixels) to travel for each click of the paging
			control button
		*/
		hPageSize: 50,
		/**
			Percentage of scroller client area to jump when paging (larger numbers
			yield faster scrolling)
		*/
		pageRatio: 0.7
	},
	//@protected
	handlers: {
		onscrollstart: "scrollStart",
		onSpotlightFocused		: "spotFocused",
		onRequestScrollIntoView	: "requestScrollIntoView",
		onenter					: "enter",
		onleave					: "leave",
		onPageHold				: "holdHandler",
		onPageHoldPulse			: "holdHandler",
		onPageRelease			: "holdHandler",
		onPaginate				: "paginate",
		onSpotlightBlur			: "blur"
	},
	/**
		Keeps track of desired scroll position on pagination since _ScrollMath_
		doesn't. Tracks Scroller's horizontal and vertical positions (which may
		change simultaneously).
	*/
	pos: {top: null, left: null},
	//* True if pointer is currently hovering over this control
	hovering: false,

	//* Override _tools_ to remove thumbs
	tools: [
		{kind: "ScrollMath", onScrollStart: "scrollMathStart", onScroll: "scrollMathScroll", onScrollStop: "scrollMathStop"}
	],

	//* Override _components_ to add thumbs and scrollbars
	components: [
		{name: "clientContainer", classes: "moon-scroller-client-wrapper", components: [
			{name: "client", classes: "enyo-touch-scroller"}
		]},
		{name: "vColumn", classes: "moon-scroller-v-column", components: [
			{name: "pageUpControl", kind: "moon.PagingControl", classes: "hidden", side: "top", content: "<"},
			{name: "vthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-vthumb-container", components: [
				{name: "vthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-vthumb hidden", axis: "v"}
			]},
			{name: "pageDownControl", kind: "moon.PagingControl", classes: "hidden", side: "bottom", content: ">"}
		]},
		{name: "hColumn", classes: "moon-scroller-h-column", components: [
			{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", content: "<"},
			{name: "hthumbContainer", classes: "moon-scroller-thumb-container moon-scroller-hthumb-container", components: [
				{name: "hthumb", kind: "moon.ScrollThumb", classes: "moon-scroller-hthumb hidden", axis: "h"}
			]},
			{name: "pageRightControl", kind: "moon.PagingControl", side: "right", content: ">"}
		]},
		{kind: "Signals", onSpotlightModeChanged: "spotlightModeChanged", isChrome: true}
	],

	/**
		Calls super-super-inherited (i.e., skips _TouchScrollStrategy_'s)
		_rendered()_ function to avoid thumb flicker at render time. Then
		shows or hides page controls.
	*/
	rendered: function() {
		enyo.TouchScrollStrategy.prototype.rendered._inherited.apply(this, arguments);
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
		this.updatePageSize();
		this.updateSpotlightPagingControls();
	},
	//* On resize, updates thumb ratio and shows or hides scroll columns.
	resizeHandler: function() {
		this.inherited(arguments);
		this.enableDisableScrollColumns();
		if (this.shouldShowPageControls()) {
			this.showHideScrollColumns(true);
		}
		this.setThumbSizeRatio();
		this.updatePageSize();
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
		captures the difference for use in thumb rendering math.
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
	enter: function() {
		this.hovering = true;
		this.showHidePageControls();
		this.showHideScrollColumns(true);
	},
	//* On leave, sets _this.hovering_ to false and shows or hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHideScrollColumns(false);
	},
	holdHandler: function(inSender, inEvent) {
		enyo.Spotlight.Accelerator.processKey(inEvent, inEvent.type == "pagerelease" ? enyo.nop : this.autoScroll, this);
		if (inEvent.type == "pagerelease" || inEvent.type == "pagehold") {
			this.pos = {top:null, left:null};
		}
	},
	//* Handles _paginate_ event sent from _PagingControl_ buttons.
	paginate: function(inSender, inEvent) {
		this.showHidePageControls();
		this.autoScroll(inEvent);
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

		var sb = this.getScrollBounds(),
			top = this.getScrollTop(),
			left = this.getScrollLeft()
		;

		this.$.pageUpControl.addRemoveClass("hidden", (top <= 0));
		this.$.pageDownControl.addRemoveClass("hidden", (top >= sb.maxTop));

		this.$.pageLeftControl.addRemoveClass("hidden", (left <= 0));
		this.$.pageRightControl.addRemoveClass("hidden", (left >= sb.maxLeft));
	},
	//* Enables or disables scroll columns.
	enableDisableScrollColumns: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		this.enableDisableVerticalScrollControls(this.showVertical(inScrollBounds));
		this.enableDisableHorizontalScrollControls(this.showHorizontal(inScrollBounds));
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
	showVertical: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		return (this.getVertical()   !== "hidden" && inScrollBounds.height > inScrollBounds.clientHeight);
	},
	//* Determines whether we should be showing the horizontal scroll column.
	showHorizontal: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		return (this.getHorizontal() !== "hidden" && inScrollBounds.width  > inScrollBounds.clientWidth);
	},
	//* Hides pagination controls.
	hidePageControls: function() {
		this.$.pageLeftControl.addClass("hidden");
		this.$.pageRightControl.addClass("hidden");
		this.$.pageUpControl.addClass("hidden");
		this.$.pageDownControl.addClass("hidden");
	},
	getScrollBounds: function() {
		return this._getScrollBounds();
	},
	//* Overrides _getScrollBounds()_, updating _cn_ to be _this.scrollNode_.
	_getScrollBounds: function() {
		var s = this.getScrollSize(), cn = this.scrollNode;
		var b = {
			left: this.getScrollLeft(),
			top: this.getScrollTop(),
			clientHeight: cn ? cn.clientHeight : 0,
			clientWidth: cn ? cn.clientWidth : 0,
			height: s.height,
			width: s.width
		};
		b.maxLeft = Math.max(0, b.width - b.clientWidth);
		b.maxTop = Math.max(0, b.height - b.clientHeight);
		return b;
	},
	autoScroll: function(inEvent) {
		var sb = this.getScrollBounds(),
			orientV = this.vertical != "hidden" && (inEvent.originator.side == "top" || inEvent.originator.side == "bottom")
		;

		if (orientV && !this.pos.top) {
			this.pos.top = sb.top;
		} else if (!this.pos.left) {
			this.pos.left = sb.left;
		}

		switch (inEvent.originator.side) {
		case "left":
			this.pos.left = this.pos.left - this.hPageSize;
			break;
		case "top":
			this.pos.top = this.pos.top - this.vPageSize;
			break;
		case "right":
			this.pos.left = this.pos.left + this.hPageSize;
			break;
		case "bottom":
			this.pos.top = this.pos.top + this.vPageSize;
			break;
		}

		if (this.pos[orientV ? "top" : "left"] > (orientV ? sb.maxTop : sb.maxLeft)) {
			this.pos.left = orientV ? sb.left:sb.maxLeft;
			this.pos.top = orientV ? sb.maxTop:sb.top;
		} else if (this.pos[orientV ? "top" : "left"] <= 0) {
			this.pos.left = orientV ? sb.left:0;
			this.pos.top = orientV ? 0:sb.top;
		} else {
			this.pos.left = orientV ? sb.left:this.pos.left;
			this.pos.top = orientV ? this.pos.top:sb.top;
		}

		this.scrollTo(this.pos.left, this.pos.top);
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
			this.scrollTo(x,y);
		}
	},
	scrollToNodex: function(inNode, inAlignWithTop) {
		this.log(inControl);
		this.log(inAlignWithTop);
	},
	//* Scrolls to a specific (x, y) position within the scroll area.
	scrollTo: function(inX, inY) {
		this.$.scrollMath.scrollTo(inX, inY || inY === 0 ? inY : null);
	},
	//* Shows or hides page controls in response to _onScrollStop_ event.
	scrollMathStop: function() {
		this.inherited(arguments);
		this.showHidePageControls();

		// TODO - fix this error condition -> scroll strategy and scroll math are out of sync!
		var diff = Math.round(this.$.scrollMath.y) * -1 - this.getScrollTop();
		if (diff != 0) {
			this.scrollTo(this.getScrollLeft(), this.getScrollTop() + diff);
		}
	},
	//* Animates on mousewheel events.
	mousewheel: function(inSender, inEvent) {
		if (this.dragging || !this.useMouseWheel) {
			return;
		}

		var dy = this.vertical ? inEvent.wheelDeltaY || inEvent.wheelDelta: 0,
			top = this.getScrollTop()
		;

		this.calcBoundaries();
		this.syncScrollMath();
		this.stabilize();

		if ((dy > 0 && top > 0) || (dy < 0 && top < this.getScrollBounds().maxTop)) {
			this.scrollTo(this.getScrollLeft(), (top - dy));
		}

		inEvent.preventDefault();
		return true;
	},
	//* Whack dragging.
	shouldDrag: function(inSender, e) {
		return false;
	}
});
