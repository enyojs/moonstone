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
		//* Distance in px to travel each paging control button click
		pageSize: 50
	},
	//@protected
	handlers: {
		onscrollstart: "scrollStart"
	},
	/**
		Keeps track of desired scroll position on pagination since ScrollMath
		doesn't. Tracks Scroller's horizontal and vertical positions (which can
		change simultaneously in one instance).
	*/
	pos: {top: null, left: null},
	//* Override _tools_ to remove thumbs
	tools: [
		{kind: "ScrollMath", onScrollStart: "scrollMathStart", onScroll: "scrollMathScroll", onScrollStop: "scrollMathStop"}
	],
	//* Override _components_ to add thumbs and scrollbars
	components: [
		{name: "clientWrapper", classes: "moon-scroller-client-wrapper", components: [
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
		]}
	],
	//* True if pointer is currently hovering over this control
	hovering: false,
	//* Creates page controls during initialization.
	initComponents: function() {
		this.inherited(arguments);
		this.createComponents([{kind: "Signals", onSpotlightModeChanged: "showHidePageControls"}]);
	},
	/**
		Call super-super-inherited (jump TouchScrollStrategy's _rendered()_ function) to avoidPosition
		thumb flicker at render time. Then show/hide page controls.
	*/
	rendered: function() {
		enyo.TouchScrollStrategy.prototype.rendered._inherited.apply(this, arguments);
		enyo.job("initScrollerThumbs" + this.id, this.bindSafely(function() { this.showHidePageControls(); this.setThumbSizeRatio(); }), 50);
	},
	//* Onresize, update thumb ratio and show/hide scroll columns
	resizeHandler: function() {
		this.inherited(arguments);
		this.setThumbSizeRatio();
		this.showHideScrollColumns();
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
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHidePageControls();
	},
	//* On scroll, show/hide pagination controls.
	domScroll: function(inSender, inEvent) {
		this.inherited(arguments);
		this.showHidePageControls();
	},
	//* Clear the tracked scroll positions when scroller drag finishes
	dragfinish: function() {
		this.inherited(arguments);
		this.pos = {top:null, left:null};
	},
	//* On mouse move, shows/hides page controls.
	mousemove: function() {
		this.hovering = true;
		this.showHidePageControls();
	},
	//* Shows/hides pagination controls as appropriate.
	showHidePageControls: function() {
		var sb = this.getScrollBounds(), s;
		
		// Show/hide vertical and horizontal columns, regardless of hover state
		this.showHideScrollColumns(sb);
		
		/*
			If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			If not hovering and set to hide on leave, hide pagination controls.
		*/
		if ((!enyo.Spotlight.getPointerMode() && this.container.getHidePagingOnKey()) || (this.container.getHidePagingOnLeave() && !this.hovering)) {
			this.hidePageControls();
			return;
		}
		
		if (this.showVertical(sb)) {
			s = this.getScrollTop();
			this.$.pageUpControl.addRemoveClass("hidden", (s <= 0));
			this.$.pageDownControl.addRemoveClass("hidden", (s >= sb.maxTop));
		} else {
			this.$.pageUpControl.addClass("hidden");
			this.$.pageDownControl.addClass("hidden");
		}
		
		if (this.showHorizontal(sb)) {
			s = this.getScrollLeft();
			this.$.pageLeftControl.addRemoveClass("hidden", (s <= 0));
			this.$.pageRightControl.addRemoveClass("hidden", (s >= sb.maxLeft));
		} else {
			this.$.pageLeftControl.addClass("hidden");
			this.$.pageRightControl.addClass("hidden");
		}
	},
	//* Show/hide horizontal and vertical scroll columns
	showHideScrollColumns: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		this.showHideVerticalScrollControls(this.showVertical(inScrollBounds));
		this.showHideHorizontalScrollControls(this.showHorizontal(inScrollBounds));
	},
	//* Show/hide vertical scroll column based in _inShow_
	showHideVerticalScrollControls: function(inShow) {
		if (inShow) {
			this.$.clientWrapper.addClass("v-scroll-enabled");
			this.$.vColumn.addClass("v-scroll-enabled");
			this.$.hColumn.addClass("v-scroll-enabled");
		} else {
			this.$.clientWrapper.removeClass("v-scroll-enabled");
			this.$.vColumn.removeClass("v-scroll-enabled");
			this.$.hColumn.removeClass("v-scroll-enabled");
		}
	},
	//* Show/hide horizontal scroll column based in _inShow_
	showHideHorizontalScrollControls: function(inShow) {
		if (inShow) {
			this.$.clientWrapper.addClass("h-scroll-enabled");
			this.$.vColumn.addClass("h-scroll-enabled");
			this.$.hColumn.addClass("h-scroll-enabled");
		} else {
			this.$.clientWrapper.removeClass("h-scroll-enabled");
			this.$.vColumn.removeClass("h-scroll-enabled");
			this.$.hColumn.removeClass("h-scroll-enabled");
		}
	},
	//* Determine if we should be showing the vertical scroll column
	showVertical: function(inScrollBounds) {
		inScrollBounds = inScrollBounds || this.getScrollBounds();
		return (this.getVertical()   !== "hidden" && inScrollBounds.height > inScrollBounds.clientHeight);
	},
	//* Determine if we should be showing the horizontal scroll column
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
	holdHandler: function(inSender, inEvent) {
		enyo.Spotlight.Accelerator.processKey(inEvent, inEvent.type == "pagerelease" ? enyo.nop : this.autoScroll, this);
		if (inEvent.type == "pagerelease" || inEvent.type == "pagehold") {
			this.pos = {top:null, left:null};
		}
	},
	getScrollBounds: function() {
		return this._getScrollBounds();
	},
	//* Override __getScrollBounds()_ to update _cn_ to be _this.scrollNode_
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
				this.pos.left = this.pos.left - this.pageSize;
				break;
			case "top":
				this.pos.top = this.pos.top - this.pageSize;
				break;
			case "right":
				this.pos.left = this.pos.left + this.pageSize;
				break;
			case "bottom":
				this.pos.top = this.pos.top + this.pageSize;
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
	//* Scrolls to specific x/y positions within the scroll area.
	scrollTo: function(inX, inY) {
		this.$.scrollMath.scrollTo(inX, inY || inY === 0 ? inY : null);
	},
	//* Animate on mousewheel events
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