/**
	_moon.List_ extends [enyo.List](#enyo.List), adding support for 5-way focus
	(Spotlight) and pagination buttons.

	At the present time, _moon.List_ requires a _strategyKind_ of
	_TouchScrollStrategy_.

	For more information, see the documentation on
	[Lists](building-apps/layout/lists.html) in the Enyo Developer Guide.
*/
enyo.kind({
	name: "moon.List",
	kind: "enyo.List",
	//* @protected
	classes: "moon-list",
	//* @protected
	/**
		Default scrolling strategy is _moon.ScrollStrategy_, which extends
		_enyo.TouchScrollStrategy_.
	*/
	strategyKind: "moon.ScrollStrategy",
	//* @protected
	spotlight: true,
	//* Handles _paginate_ events sent by PagingControl buttons.
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
			sb = this.$.strategy.getScrollBounds(),
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
			sb = this.$.strategy.getScrollBounds(),
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
	/**
		Finds page at one clientHeight/clientWidth before the current top/left
		position.
	*/
	findBoundingPageOnBack: function() {
		var sb = this.$.strategy.getScrollBounds(),
			coordinate = this.orientV ? sb.top - sb.clientHeight : sb.left - sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	/**
		Finds page at one clientHeight/clientWidth after the current top/left
		position.
	*/
	findBoundingPageOnForward: function() {
		var sb = this.$.strategy.getScrollBounds(),
			coordinate = this.orientV ? sb.top + sb.clientHeight : sb.left + sb.clientWidth,
			pageInfo = this.positionToPageInfo(coordinate);

		return (pageInfo.no === this.p0) ? this.$.page0 : this.$.page1;
	},
	//* Scrolls to a given node in the list.
	animateToNode: function(inNode, inLazy) {
		var sb = this.$.strategy.getScrollBounds(),
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