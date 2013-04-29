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
	pos: null, //keeps track of desired scroll position on pagination since ScrollMath doesn't keep it
	holdHandler: function(inSender, inEvent) {
		enyo.Spotlight.Accelerator.processKey(inEvent, this.paginate, this);
		if (inEvent.type == "pagerelease") {
			this.pos = null;
		}
	},
	paginate: function(inEvent){
		var sb = this.getScrollBounds(),
		orientV = this.vertical != "hidden";
		if (!this.pos) {
			this.pos = orientV ? sb.top : sb.left;
		}
		switch (inEvent.originator.side) {
			case "left": 
			case "top":
				this.pos = this.pos - this.pageSize;
				break;
			case "right":
			case "bottom":
				this.pos = this.pos + this.pageSize;
				break;
		}
		if (this.pos > (orientV ? sb.maxTop : sb.maxLeft)) {
			this.scrollTo(orientV ? 0:sb.maxLeft, orientV ? sb.maxTop:0)
			return;
		} else if (this.pos <= 0) {
			this.scrollTo(0, 0);
			return;
		}
		this.scrollTo(orientV ? 0:this.pos, orientV ? this.pos:0);
	}
});