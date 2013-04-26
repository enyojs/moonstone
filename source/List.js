/**
	_moon.List_ inherits from _enyo.List_, adding support for 5-way focus
	(Spotlight) and pagination buttons.

	For the time being, _moon.List_ requires a _strategyKind_ of _TouchScrollStrategy_.

	For more information, see the documentation on
	[Lists](https://github.com/enyojs/enyo/wiki/Lists)
	in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.List",
	kind: "enyo.List",
	classes: "moon-list",
	published: {
		//* If true, paging controls are hidden if a key is pressed (5-way mode)
		hidePagingOnKey: true,
		//* If true, paging controls are hidden if the user's pointer leaves this control
		hidePagingOnLeave: true
	},
	//* @protected
	handlers: {
		onleave: "leave",
		onmousemove: "mousemove",
		onPageHold: "holdHandler",
		onPageHoldPulse: "holdHandler",		
		onPageRelease: "holdHandler"
	},
	touch: true,
	spotlight: true,
	pos: null, //keeps track of desired scroll position on pagination since ScrollMath doesn't keep it

	/************** Begin moon.List/moon.Scroller identical code - this should be moved to a base class ************/


	//* Pagination buttons
	pageControls: [
		{name: "pageLeftControl", kind: "moon.PagingControl", side: "left", showing: false},
		{name: "pageRightControl", kind: "moon.PagingControl", side: "right", showing: false},
		{name: "pageUpControl", kind: "moon.PagingControl", side: "top", showing: false},
		{name: "pageDownControl", kind: "moon.PagingControl", side: "bottom", showing: false}
	],
	//* If true, the pointer is currently hovering over this control
	hovering: false,
	//* Cache scroll bounds so we don't have to run _stop()_ every time we need them
	scrollBounds: {},
	components: [
		//* Signal to listen for spotlight mode changing from 5-way to pointer
		{kind: "Signals", onSpotlightModeChanged: "showHidePageControls"}
	],
	//* Creates page controls during initialization.
	initComponents: function() {
		this.createPageControls();
		this.inherited(arguments);
	},
	//* Creates _this.pageControls_ as chrome components.
	createPageControls: function() {
		this.createChrome(this.pageControls);
	},
	//* Updates the cached _this.scrollBounds_ property and positions page controls.
	rendered: function() {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.positionPageControls();
		this.showHidePageControls();
	},
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHidePageControls();
	},
	//* On scroll, updates cached _this.scrollBounds_ property and shows/hides
	//* pagination controls.
	scroll: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.showHidePageControls();
	},
	//* At the beginning of a scroll event, caches the scroll bounds in
	//* _this.scrollBounds_.
	scrollStart: function() {
		this.updateScrollBounds();
		this.inherited(arguments);
	},
	//* On mouse move, shows/hides page controls.
	mousemove: function() {
		this.hovering = true;
		this.showHidePageControls();
	},
	//* Shows/hides pagination controls as appropriate.
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
	//* Positions each of the four pagination controls.
	positionPageControls: function() {
		this.positionPageControl(this.$.pageLeftControl);
		this.positionPageControl(this.$.pageRightControl);
		this.positionPageControl(this.$.pageUpControl);
		this.positionPageControl(this.$.pageDownControl);
	},
	//* Positions _inControl_ based on its _side_ value (top, right, bottom, or left).
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
	//* Hides pagination controls.
	hidePageControls: function() {
		this.$.pageLeftControl.hide();
		this.$.pageRightControl.hide();
		this.$.pageUpControl.hide();
		this.$.pageDownControl.hide();
	},
	//* Caches scroll bounds in _this.scrollBounds_ so we don't have to call
	//* _stop()_ to retrieve them later.
	// TODO - come back to this...
	updateScrollBounds: function() {
		this.scrollBounds = this.$.strategy._getScrollBounds();
	},
	holdHandler: function(inSender, inEvent) {
		enyo.Spotlight.Accelerator.processKey(inEvent, this.paginate, this);
		if (inEvent.type == "pagerelease") {
			this.pos = null;
		}
	},
	paginate: function(inEvent){
		var sb = this.scrollBounds;		
		if (!this.pos) {
			this.pos = this.orientV ? sb.top : sb.left;
		}
		switch (inEvent.originator.name.replace("Control","")) {
			case "pageLeft": 
			case "pageUp":
				this.pos = this.pos - this.rowSize;
				break;
			case "pageRight":
			case "pageDown":
				this.pos = this.pos + this.rowSize;
				break;
		}
		if (this.pos > (this.orientV ? sb.maxTop : sb.maxTop)) {
			this.scrollTo(this.orientV ? 0:sb.maxLeft, this.orientV ? sb.maxTop:0)
			return;
		} else if (this.pos <= 0) {
			this.scrollTo(0, 0);
			return;
		}
		this.scrollTo(this.orientV ? 0:this.pos, this.orientV ? this.pos:0);
	},
	//* Scrolls to a given node in the list.
	animateToNode: function(inNode, inLazy) {
		var sb = this.scrollBounds,
			st = this.getStrategy(),
			b = {
				height: inNode.offsetHeight,
				width: inNode.offsetWidth,
				top: 0,
				left: 0
			},
			n = inNode;

		if(!st.scrollNode) {
			return;
		}

		while (n && n.parentNode && n.id != st.scrollNode.id) {
			b.top += n.offsetTop;
			b.left += n.offsetLeft;
			n = n.parentNode;
		}

		var xDir = b.left - sb.left > 0 ? 1 : b.left - sb.left < 0 ? -1 : 0;
		var yDir = b.top - sb.top > 0 ? 1 : b.top - sb.top < 0 ? -1 : 0;

		var y = (yDir === 0) ? sb.top :
			(inLazy)
				?	(yDir === 1)
					?	b.top + b.height - sb.clientHeight
					:	b.top
				:	Math.min(sb.maxTop, b.top);

		var x = (xDir === 0) ? sb.left :
			(inLazy)
				?	(xDir === 1)
					?	b.left + b.width - sb.clientWidth
					:	b.left
				:	Math.min(sb.maxLeft, b.left);

		// If x or y changed, scroll to new position
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x,y);
		}
	}
});