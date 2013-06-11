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
	classes:   "moon-scroller",
	published: {
		//* Percentage of scroller client area to jump when paging
		pageRatio: 0.7,
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
	handlers: {
		onSpotlightFocused		: "spotFocused",
		onRequestScrollIntoView	: "requestScrollIntoView",
		onleave					: "leave",
		onmousemove				: "mousemove",
		onPageHold				: "holdHandler",
		onPageHoldPulse			: "holdHandler",
		onPageRelease			: "holdHandler",
		onPaginate				: "paginate"
	},
	pagingControls: [
		{name: "wrapper", classes: "enyo-fit", kind: "FittableRows", isChrome: true, components: [
			{name: "vWrapper", kind: "FittableColumns", fit: true, classes: "moon-scroller-chrome", isChrome: true, components: [
				{name: "strategyWrapper", classes: "moon-scroll-wrapper moon-scroller-chrome", fit: true, isChrome: true},
				{name: "vControls", kind: "FittableRows", classes: "moon-scroller-chrome moon-scroller-v-column", components: [
					{classes: "moon-scroller-chrome moon-scroller-paging-wrapper", components: [
						{name: "pageUpControl", kind: "moon.PagingControl", side: "top", content: ">", showing: false},
					]},
					{name: "vthumbContainer", fit: true, classes: "moon-scroller-chrome moon-scroller-thumb-container", isChrome: true, components: [
						{name: "vthumb", kind: "moon.ScrollThumb", axis: "v", showing: false},
					]},
					{classes: "moon-scroller-chrome moon-scroller-paging-wrapper", components: [
						{name: "pageDownControl", kind: "moon.PagingControl", side: "bottom", content: "<", showing: false},
					]}
				]}
			]},
			{name: "hControls", kind: "FittableColumns", classes: "moon-scroller-chrome moon-scroller-h-column", components: [
				{classes: "moon-scroller-chrome moon-scroller-paging-wrapper", components: [
					{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", content: "<", showing: false},
				]},
				{name: "hthumbContainer", fit: true, classes: "moon-scroller-chrome moon-scroller-thumb-container", isChrome: true, components: [
					{name: "hthumb", kind: "moon.ScrollThumb", axis: "h", showing: false},
				]},
				{classes: "moon-scroller-chrome moon-scroller-paging-wrapper", components: [
					{name: "pageRightControl", kind: "moon.PagingControl", side: "right", content: ">", showing: false},
				]},
				{name: "vPadBox", classes: "moon-scroller-chrome moon-scroller-paging-wrapper"}
			]}
		]}
	],
	//* If true, the pointer is currently hovering over this control
	hovering: false,
	
	initComponents: function() {
		this.strategyKind = "moon.ScrollStrategy";
		this.inherited(arguments);
		this.createComponent({kind: "Signals", onSpotlightModeChanged: "showHidePageControls"});
	},
	rendered: function() {
		this.inherited(arguments);
		
		var sb = this.$.strategy._getScrollBounds();
		
		// Workaround for page control issue GF-2728
		this.scrollTo(this.scrollLeft);
		
		this.$.strategy.setPageSize(this.getVertical() !== "hidden" ? sb.clientHeight*this.pageRatio : sb.clientWidth*this.pageRatio);
		
		this.setThumbSizeRatio();
		
		// TODO - why do we need a timeout here?? Race condition!
		setTimeout(enyo.bind(this, function() { this.showHidePageControls(); }), 50);
	},
	//* Override _strategyKindChanged()_ to allow for insertion of paging controls
	strategyKindChanged: function() {
		// Destroy existing strategy
		if (this.$.strategy) {
			this.$.strategy.destroy();
			this.controlParent = null;
		}
		
		// Create paging controls
		this.createPagingControls();
		
		this.controlParent = this.$.strategyWrapper;
		
		// note: createComponents automatically updates controlParent.
		this.createStrategy();
		if (this.hasNode()) {
			this.render();
		}
	},
	//* Create paging controls, scrollbars, and the client node wrapper
	createPagingControls: function() {
		this.createComponents(this.pagingControls);
	},
	//* Pass hthumb and vthumb references down to strategy
	createStrategy: function() {
		this.createComponents([{name: "strategy", maxHeight: this.maxHeight,
			kind: this.strategyKind, thumb: this.thumb,
			preventDragPropagation: this.preventDragPropagation,
			overscroll:this.touchOverscroll, isChrome: true,
			hthumb: this.$.hthumb, vthumb: this.$.vthumb}]);
	},
	//* On resize, update thumb ratio and show/hide page control columns
	resizeHandler: function() {
		this.inherited(arguments);
		this.setThumbSizeRatio();
		this.showHidePageControls();
	},
	/**
		Because the thumb columns are a fixed size that impacts the scrollbounds, capture
		the differenceand use in thumb rendering math.
	*/
	setThumbSizeRatio: function() {
		var scrollBounds = this.$.strategy._getScrollBounds();
		
		this.$.vthumb.setSizeRatio(this.$.vthumbContainer.getBounds().height/scrollBounds.clientHeight);
		this.$.hthumb.setSizeRatio(this.$.hthumbContainer.getBounds().width/scrollBounds.clientWidth);
	},
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHidePageControls();
	},
	//* On mouse move, shows/hides page controls.
	mousemove: function() {
		this.hovering = true;
		this.showHidePageControls();
	},
	holdHandler: function(inSender, inEvent) {
		this.$.strategy.holdHandler(inSender, inEvent);
	},
	//* Handles _paginate_ event sent from PagingControl buttons.
	paginate: function(inSender, inEvent) {
		this.$.strategy.autoScroll(inEvent);
	},
	//* Scrolls a child component into view if it bubbles an _onSpotlightFocused_
	//* event (and it is not already in view).
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			return;
		}

		if ((!this.$.strategy.isInView(inEvent.originator.hasNode())) && (!enyo.Spotlight.getPointerMode())) {
			this.animateToControl(inEvent.originator);
		}
	},
	//* Responds to child components' requests to be scrolled into view.
	requestScrollIntoView: function(inSender, inEvent) {
		if (!enyo.Spotlight.getPointerMode()) {
			this.animateToControl(inEvent.originator, inEvent.scrollFullPage);
		}
		return true;
	},
	/**
		Scrolls until _inControl_ is in view. If _inScrollFullPage_ is set, scrolls
		until the edge of _inControl_ is aligned with the edge of the visible scroll
		area.
	*/
	animateToControl: function(inControl, inScrollFullPage) {
		var controlBounds  = enyo.Spotlight.Util.getAbsoluteBounds(inControl),
			absoluteBounds = enyo.Spotlight.Util.getAbsoluteBounds(this),
			scrollBounds   = this.$.strategy._getScrollBounds(),
			offsetTop      = controlBounds.top - absoluteBounds.top,
			offsetLeft     = controlBounds.left - absoluteBounds.left,
			offsetHeight   = controlBounds.height,
			offsetWidth    = controlBounds.width,
			xDir,
			yDir,
			x,
			y;

		// Allow local inScrollFullPage param to override scroller property
		inScrollFullPage = (typeof inScrollFullPage === "undefined") ? this.getScrollFullPage() : inScrollFullPage;

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
			this.scrollTo(x,y);
		}
	},
	
	
	
	//* Paging control logic
	
	//* Show/hide individual page controls as appropriate.
	showHidePageControls: function() {
		/*
			If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			If not hovering and set to hide on leave, hide pagination controls.
		*/
		if ((!enyo.Spotlight.getPointerMode() && this.getHidePagingOnKey()) || (this.getHidePagingOnLeave() && !this.hovering)) {
			this.hidePageControls();
			return;
		}
		
		var sb = this.$.strategy._getScrollBounds(),
			showHorizontal = (this.getHorizontal() !== "hidden" && sb.clientWidth < sb.width),
			showVertical   = (this.getVertical()   !== "hidden" && sb.clientHeight < sb.height),
			s
		;
		
		if (showHorizontal) {
			s = this.getScrollLeft();
			this.$.pageLeftControl.setShowing(s > 0);
			this.$.pageRightControl.setShowing(s < sb.maxLeft);
			this.$.hControls.show();
		} else {
			this.$.pageLeftControl.hide();
			this.$.pageRightControl.hide();
			this.$.hControls.hide();
		}

		if (showVertical) {
			s = this.getScrollTop();
			this.$.pageUpControl.setShowing(s > 0);
			this.$.pageDownControl.setShowing(s < sb.maxTop);
			this.$.vControls.show();
			this.$.vPadBox.show();
		} else {
			this.$.pageUpControl.hide();
			this.$.pageDownControl.hide();
			this.$.vControls.hide();
			this.$.vPadBox.hide();
		}
		
		// TODO - why do we need all of these reflows?!?!
		this.$.wrapper.reflow(); // fixes v
		this.$.vControls.reflow(); // fixes v
		this.$.hControls.reflow(); // fixes h
		this.$.vWrapper.reflow(); // fixes h
	},
	//* Hides pagination controls.
	hidePageControls: function() {
		this.$.pageLeftControl.hide();
		this.$.pageRightControl.hide();
		this.$.pageUpControl.hide();
		this.$.pageDownControl.hide();
	},
	//* Facade for _strategy.getHorizontal()_
	getHorizontal: function() {
		return this.$.strategy.getHorizontal();
	},
	//* Facade for _strategy.getVertical()_
	getVertical: function() {
		return this.$.strategy.getVertical();
	}
});
