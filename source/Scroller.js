/**
	_moon.Scroller_ inherits from _enyo.Scroller_, and adds 5-way focus (Spotlight)
	support and pagination buttons.

	For the time being, _moon.Scroller_ requires a _strategyKind_ of _TouchScrollStrategy_.
	
	_moon.Scroller_ responds to the _onSpotlightFocused_ event by scrolling the event
	originator into view. This way 5-way (Spotlight) focused controls are always in view.
	
	Additionally, _moon.Scroller_ will respond to explicit/programmatic requests from controls
	to be scrolled into view via the _onRequestScrollIntoView_ event.

	For more information, see the documentation on
	[Scrollers](https://github.com/enyojs/enyo/wiki/Scrollers) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.Scroller",
	kind: "enyo.Scroller",
	spotlight: "container",
	published: {
		//* Percent of scroller client area to jump when paging
		pageRatio: 0.7,
		//* If true, hide the paging controls if a key is pressed (5 way mode)
		hidePagingOnKey: true,
		//* If true, hide the paging controls if user's pointer leaves this control
		hidePagingOnLeave: true,
		/**
			If true, when scrolling to focused child controls, scroller will scroll as far as
			possible, until it's edge meets the next item's edge.
		*/
		scrollFullPage: false
	},
	//* @protected
	handlers: {
		onSpotlightFocused: "spotFocused",
		onRequestScrollIntoView: "requestScrollIntoView",
		onleave: "leave",
		onmousemove: "mousemove",
		onPaginate: "paginate"
	},
	touch: true,
	
	
	/************** Begin moon.List/moon.Scroller identical code - this should be moved to a base class ************/
	
	
	//* Pagination buttons
	pageControls: [
		{name: "pageLeftControl", kind: "moon.PagingControl", side: "left"},
		{name: "pageRightControl", kind: "moon.PagingControl", side: "right"},
		{name: "pageUpControl", kind: "moon.PagingControl", side: "top"},
		{name: "pageDownControl", kind: "moon.PagingControl", side: "bottom"}
	],
	//* If true, the pointer is currently hovering over this control
	hovering: false,
	//* Cache scroll bounds so we don't have to run stop() every time we need them
	scrollBounds: {},
	components: [
		//* Signal to listen for spotlight mode changing from 5-way to pointer
		{kind: "Signals", onSpotlightModeChanged: "showHidePageControls"}
	],
	//* During initialization, create page controls
	initComponents: function() {
		this.createPageControls();
		this.inherited(arguments);
	},
	//* Create _this.pageControls_ as chrome components
	createPageControls: function() {
		this.createChrome(this.pageControls);
	},
	//* Update the cached _this.scrollBounds_ property and position page controls
	rendered: function() {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.positionPageControls();
		this.showHidePageControls();
	},
	//* On leave, set _this.hovering_ to false and show/hide pagination controls
	leave: function() {
		this.hovering = false;
		this.showHidePageControls();
	},
	//* On scroll, update our cached _this.scrollBounds_ property, and show/hide pagination controls
	scroll: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.showHidePageControls();
	},
	//* At the beginning of a scroll event, cache the scroll bounds in _this.scrollBounds_
	scrollStart: function() {
		this.updateScrollBounds();
		this.inherited(arguments);
	},
	//* On mouse move, show/hide page controls
	mousemove: function() {
		this.hovering = true;
		this.showHidePageControls();
	},
	//* Show/hide pagination controls as appropriate
	showHidePageControls: function() {
		if (
			// If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			(!enyo.Spotlight.getPointerMode() && this.getHidePagingOnKey()) ||
			// If not hovering and set to hide on leave, hide pagination controls.
			(this.getHidePagingOnLeave() && !this.hovering)
		   ) {
			this.hidePageControls();
			return;
		}
		
		var sb = this.scrollBounds,
			s;
		
		if (this.getHorizontal() !== "hidden") {
			s = this.getScrollLeft();
			this.$.pageLeftControl.setShowing(s > 0);
			this.$.pageRightControl.setShowing(s < sb.maxLeft);
		} else {
			this.$.pageLeftControl.hide();
			this.$.pageRightControl.hide();
		}
		
		if (this.getVertical() !== "hidden") {
			s = this.getScrollTop();
			this.$.pageUpControl.setShowing(s > 0);
			this.$.pageDownControl.setShowing(s < sb.maxTop);
		} else {
			this.$.pageUpControl.hide();
			this.$.pageDownControl.hide();
		}
	},
	//* Position each of the four pagination controls
	positionPageControls: function() {
		this.positionPageControl(this.$.pageLeftControl);
		this.positionPageControl(this.$.pageRightControl);
		this.positionPageControl(this.$.pageUpControl);
		this.positionPageControl(this.$.pageDownControl);
	},
	//* Position _inControl_ based on it's _side_ value (top, right, bottom, or left)
	positionPageControl: function(inControl) {
		var sb = this.scrollBounds,
			cb = inControl.getBounds(),
			side = inControl.getSide(),
			attribute,
			position;
		
		if (side === "top" || side === "bottom") {
			attribute = "left";
			position = sb.clientWidth/2 - cb.width/2;
		} else {
			attribute = "top";
			position = sb.clientHeight/2 - cb.height/2;
		}
		
		inControl.applyStyle(attribute,position+"px");
	},
	//* Hide pagination controls
	hidePageControls: function() {
		this.$.pageLeftControl.hide();
		this.$.pageRightControl.hide();
		this.$.pageUpControl.hide();
		this.$.pageDownControl.hide();
	},
	//* Cache scroll bounds in _this.scrollBounds_ so we don't have to call stop() to retrieve them later
	// TODO - come back to this...
	updateScrollBounds: function() {
		this.scrollBounds = this.$.strategy._getScrollBounds();
	},
	
	
	
	
	
	
	
	
	
	
	
	/*************** Begin moon.Scroller unique code ***************/
	
	//* Handle paginate event sent from PagingControl buttons
	paginate: function(inSender, inEvent) {
		var sb = this.getScrollBounds(),
			side = inEvent.side;
		
		switch (side) {
			case "top":
				this.scrollTo(this.getScrollLeft(), sb.top - (sb.clientHeight*this.pageRatio));
				break;
			case "right":
				this.scrollTo(sb.left + (sb.clientWidth*this.pageRatio), this.getScrollTop());
				break;
			case "bottom":
				this.scrollTo(this.getScrollLeft(), sb.top + (sb.clientHeight*this.pageRatio));
				break;
			case "left":
				this.scrollTo(sb.left - (sb.clientWidth*this.pageRatio), this.getScrollTop());
				break;
		}
	},
	//* If a child component bubbles an onSpotlightFocused event, scroll it into view (if not already)
	spotFocused: function(inSender, inEvent) {
		if (inEvent.originator === this) {
			return;
		}
		
		if (!this.$.strategy.isInView(inEvent.originator.hasNode())) {
			this.updateScrollBounds();
			this.animateToControl(inEvent.originator);
		}
	},
	//* Respond to child component requests to be scrolled into view
	requestScrollIntoView: function(inSender, inEvent) {
		this.updateScrollBounds();
		this.animateToControl(inEvent.originator, inEvent.scrollFullPage);
		return true;
	},
	/**
		Scroll until _inControl_ is in view. If _inScrollFullPage_ is set, scroll until _inControl_'s
		edge is aligned with visible scroll area's edge.
	*/
	animateToControl: function(inControl, inScrollFullPage) {
		var controlBounds  = inControl.getAbsoluteBounds(),
			absoluteBounds = this.getAbsoluteBounds(),
			scrollBounds   = this.scrollBounds,
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
			?	0
			:	offsetLeft - scrollBounds.left > 0 ? 1 : offsetLeft - scrollBounds.left < 0 ? -1 : 0;
		// 0: currently visible, 1: below viewport, -1: above viewport
		yDir = (offsetTop >= scrollBounds.top && offsetTop + offsetHeight <= scrollBounds.top + scrollBounds.clientHeight)
			?	0
			:	offsetTop - scrollBounds.top > 0 ? 1 : offsetTop - scrollBounds.top < 0 ? -1 : 0;
		
		switch (xDir) {
			case 0:
				x = this.getScrollLeft();
				break;
			case 1:
				// If control requested to be scrolled all the way to the viewport's left, or if the control
				// is larger than the viewport, scroll to the control's left edge. Otherwise scroll just
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
				// is larger than the viewport, scroll to the control's right edge. Otherwise scroll just
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
				// is larger than the viewport, scroll to the control's top edge. Otherwise scroll just
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
				// is larger than the viewport, scroll to the control's bottom edge. Otherwise scroll just
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
	}
});
