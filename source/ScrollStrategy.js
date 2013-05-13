/**
	_moon.ScrollStrategy_ inherits from _enyo.TouchScrollStrategy_ and whose main
	purpose is to handle scroller paging for _moon.Scroller_ & _moon.List_.
*/
enyo.kind({
	name: "moon.ScrollStrategy",
	kind: "enyo.TouchScrollStrategy",
	published: {
		pageSize: 50
	},
	handlers: {
		onscrollstart: "scrollStart"
	},
	/** 
		Keeps track of desired scroll position on pagination since ScrollMath doesn't keep it. 
		Tracking horizontal & vertical for Scroller which can move both ways in one instance.
	*/
	pos: {top: null, left: null},
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
	//* Creates page controls during initialization.
	initComponents: function() {
		this.createPageControls();
		this.inherited(arguments);
		this.createComponents([{kind: "Signals", onSpotlightModeChanged: "showHidePageControls"}]);		
	},
	//* Creates _this.pageControls_ as chrome components.
	createPageControls: function() {
		this.container.createChrome(this.pageControls);
	},
	//* Updates the cached _this.scrollBounds_ property and positions page controls.
	rendered: function() {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.positionPageControls();
		this.showHidePageControls();
	},
	resizeHandler: function() {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.positionPageControls();
	},
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.hovering = false;
		this.showHidePageControls();
	},
	//* On scroll, updates cached _this.scrollBounds_ property and shows/hides
	//* pagination controls.
	domScroll: function(inSender, inEvent) {
		this.inherited(arguments);
		this.updateScrollBounds();
		this.showHidePageControls();
	},
	//* Clear the tracked scroll positions when scroller drag finishes
	dragfinish: function() {
		this.inherited(arguments);
		this.pos = {top:null, left:null};
	},
	//* At the beginning of a scroll event, caches the scroll bounds in
	//* _this.scrollBounds_.
	scrollStart: function() {
		this.updateScrollBounds();
	},
	//* On mouse move, shows/hides page controls.
	mousemove: function() {
		this.hovering = true;
		this.showHidePageControls();
	},
	//* Shows/hides pagination controls as appropriate.
	showHidePageControls: function() {
		if ((!enyo.Spotlight.getPointerMode() && this.container.getHidePagingOnKey()) ||		// If we're not in pointer mode, and set to hide paging on key, hide pagination controls.
			(this.container.getHidePagingOnLeave() && !this.hovering)) {						// If not hovering and set to hide on leave, hide pagination controls.
			this.hidePageControls();
			return;
		}

		var sb = this.scrollBounds,
			s;

		if (this.getHorizontal() !== "hidden") {
			s = this.getScrollLeft();
			this.container.$.pageLeftControl.setShowing(s > 0);
			this.container.$.pageRightControl.setShowing(s < sb.maxLeft);
		} else {
			this.container.$.pageLeftControl.hide();
			this.container.$.pageRightControl.hide();
		}

		if (this.getVertical() !== "hidden") {
			s = this.getScrollTop();
			this.container.$.pageUpControl.setShowing(s > 0);
			this.container.$.pageDownControl.setShowing(s < sb.maxTop);
		} else {
			this.container.$.pageUpControl.hide();
			this.container.$.pageDownControl.hide();
		}
	},
	//* Positions each of the four pagination controls.
	positionPageControls: function() {
		this.positionPageControl(this.container.$.pageLeftControl);
		this.positionPageControl(this.container.$.pageRightControl);
		this.positionPageControl(this.container.$.pageUpControl);
		this.positionPageControl(this.container.$.pageDownControl);
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
		this.container.$.pageLeftControl.hide();
		this.container.$.pageRightControl.hide();
		this.container.$.pageUpControl.hide();
		this.container.$.pageDownControl.hide();
	},
	//* Caches scroll bounds in _this.scrollBounds_ so we don't have to call
	//* _stop()_ to retrieve them later.
	// TODO - come back to this...
	updateScrollBounds: function() {
		this.scrollBounds = this._getScrollBounds();
	},
	holdHandler: function(inSender, inEvent) {
		enyo.Spotlight.Accelerator.processKey(inEvent, inEvent.type == "pagerelease" ? enyo.nop : this.autoScroll, this);
		if (inEvent.type == "pagerelease" || inEvent.type == "pagehold") {
			this.pos = {top:null, left:null};
		}
	},
	autoScroll: function(inEvent){
		var sb = this.getScrollBounds(),
		orientV = this.vertical != "hidden" && 
				  (inEvent.originator.side == "top" || 
				  inEvent.originator.side == "bottom");
	
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
		this.updateScrollBounds();
	}
});