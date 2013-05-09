/**
	_moon.List_ extends <a href="#enyo.List">enyo.List</a>, adding support for
	5-way focus (Spotlight) and pagination buttons.

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
		hidePagingOnLeave: true,
		//* Amount to scroll when a paging control is tapped. By default set to the row size.
		pageSize: null
	},
	//* @protected
	handlers: {
		onleave: "leave",
		onmousemove: "mousemove",
		onPaginate: "paginate",
		onPageHold: "holdHandler",
		onPageHoldPulse: "holdHandler",		
		onPageRelease: "holdHandler"		
	},
	touch: true,
	spotlight: true,
	initComponents: function() {
		this.strategyKind = "moon.ScrollStrategy",
		this.inherited(arguments);
	},
	rendered: function() {
		this.inherited(arguments);
		this.$.strategy.setPageSize(this.pageSize ? this.pageSize : this.rowSize);
	},
	//* On leave, sets _this.hovering_ to false and shows/hides pagination controls.
	leave: function() {
		this.$.strategy.leave();
	},
	//* On mouse move, shows/hides page controls.
	mousemove: function() {
		this.$.strategy.mousemove();
	},
	scrollStart: function() {
		this.$.strategy.scrollStart();
		this.inherited(arguments);		
	},	
	holdHandler: function(inSender, inEvent) {
		//Create a job to prevent pagination on tap if the intention is to auto scroll on hold
		if (inEvent.type == 'pagehold') {
			this.startJob('preventPaginate', this.bindSafely(function(){this.preventPaginate = true}), 200);
		} else if (inEvent.type == 'pagerelease') {
			this.stopJob('preventPaginate');
		}
		this.$.strategy.holdHandler(inSender, inEvent);
	},
	//* Handles _paginate_ event sent from PagingControl buttons.
	paginate: function(inSender, inEvent) {
		if (this.preventPaginate){
			this.stopJob('preventPaginate');			
			this.preventPaginate = false;
			return;
		}
		switch (inEvent.side) {
		case "top":
		case "left":
			this.pageBack();
			break;
		case "bottom":
		case "right":
			this.pageForward();
			break;
		}
	},
	//* Scrolls one page backward, lining up with the appropriate node.
	pageBack: function() {
		var i = this.$.generator.hasNode().querySelector('#' + this.findBoundingPageOnBack().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10),
			sb = this.$.strategy.scrollBounds,
			node,
			pageDelta,
			threshold = this.orientV ? sb.top : sb.left;

		for(i;i<this.count;i++) {
			node = this.$.generator.fetchRowNode(i);

			pageDelta = (this.orientV)
				?	(node.offsetParent.offsetTop  + node.offsetTop  + sb.clientHeight)
				:	(node.offsetParent.offsetLeft + node.offsetLeft + sb.clientWidth);

			// Find the first node whose top/left edge will be at or past the scrollers top/left edge when scrolled
			if (pageDelta >= threshold) {
				this.animateToNode(node);
				return;
			}
		}
	},
	//* Scrolls one page forward, lining up with the appropriate node.
	pageForward: function() {
		var i = this.$.generator.hasNode().querySelector('#' + this.findBoundingPageOnForward().id + " div[data-enyo-index]").getAttribute("data-enyo-index", 10),
			sb = this.$.strategy.scrollBounds,
			node,
			nodeEdge,
			threshold = this.orientV ? sb.top + sb.clientHeight : sb.left + sb.clientWidth;

		for(i;i<this.count;i++) {
			node = this.$.generator.fetchRowNode(i);
			nodeEdge = (this.orientV)
				?	(node.offsetParent.offsetTop  + node.offsetTop  + node.clientHeight)
				:	(node.offsetParent.offsetLeft + node.offsetLeft + node.clientWidth);

			// Scroll to the first offscreen (or partially offscreen) node
			if (nodeEdge > threshold) {
				this.animateToNode(node);
				return;
			}
		}
	},
	//* Finds page at one clientHeight/Width before the current top/left position.
	findBoundingPageOnBack: function() {
		var sb = this.$.strategy.scrollBounds,
			coordinate = this.orientV ? sb.top - sb.clientHeight : sb.left - sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	//* Finds page at one clientHeight/Width after the current top/left position.
	findBoundingPageOnForward: function() {
		var sb = this.$.strategy.scrollBounds,
			coordinate = this.orientV ? sb.top + sb.clientHeight : sb.left + sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	//* Scrolls to a given node in the list.
	animateToNode: function(inNode, inLazy) {
		var sb = this.$.strategy.scrollBounds,
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