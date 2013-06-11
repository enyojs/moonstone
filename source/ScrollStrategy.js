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
	tools: [
		{kind: "ScrollMath", onScrollStart: "scrollMathStart", onScroll: "scrollMathScroll", onScrollStop: "scrollMathStop"}
	],
	//* Clear the tracked scroll positions when scroller drag finishes
	dragfinish: function() {
		this.inherited(arguments);
		this.pos = {top:null, left:null};
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
	},
	//* Override to use _this.parent_ rather than _this.container_ as reference node (no longer the same node)
	_getScrollBounds: function() {
		var s = this.getScrollSize(),
			cn = this.parent.hasNode(),
			b = {
				left: this.getScrollLeft(),
				top: this.getScrollTop(),
				clientHeight: cn ? cn.clientHeight : 0,
				clientWidth: cn ? cn.clientWidth : 0,
				height: s.height,
				width: s.width
			}
		;

		b.maxLeft = Math.max(0, b.width - b.clientWidth);
		b.maxTop = Math.max(0, b.height - b.clientHeight);

		return b;
	},

	//* Overridden thumb logic

	//* Show thumbs then hide after 0.5 seconds
	alertThumbs: function() {
		this.showThumbs();
		this.delayHideThumbs(500);
	},
	//* Syncs the vertical and horizontal scroll indicators.
	syncThumbs: function() {
		this.vthumb.sync(this);
		this.hthumb.sync(this);
	},
	//* Update thumb size/position
	updateThumbs: function() {
		this.vthumb.update(this);
		this.hthumb.update(this);
	},
	//* Syncs and shows both the vertical and horizontal scroll indicators.
	showThumbs: function() {
		this.syncThumbs();
		if (this.horizontal != "hidden") {
			this.hthumb.show();
		}
		if (this.vertical != "hidden") {
			this.vthumb.show();
		}
	},
	//* Hides the vertical and horizontal scroll indicators.
	hideThumbs: function() {
		this.vthumb.hide();
		this.hthumb.hide();
	},
	//* Hides the vertical and horizontal scroll indicators asynchronously.
	delayHideThumbs: function(inDelay) {
		this.vthumb.delayHide(inDelay);
		this.hthumb.delayHide(inDelay);
	}
});