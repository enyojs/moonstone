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
	
	handlers: {
		onSpotlightFocus  : 'onSpotlightFocus',
		onSpotlightBlur   : 'onSpotlightBlur',
		onSpotlightSelect : 'onSpotlightSelect',
		onSpotlightDown   : 'onSpotlightDown',
		onSpotlightUp     : 'onSpotlightUp',
		onSpotlightLeft   : 'onSpotlightLeft',
		onSpotlightRight  : 'onSpotlightRight',
		onmove            : 'onMove'
	},
	
	//* @protected
	classes: "moon-list",
	//* @protected
	/**
		Default scrolling strategy is _moon.ScrollStrategy_, which extends
		_enyo.TouchScrollStrategy_.
	*/
	strategyKind: "moon.ScrollStrategy",
	//* @protected
	spotlight         : true,
	//* @protected
	spotlightDecorate : false,
	
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
			b.left += (this.rtl? n.offsetRight : n.offsetLeft);
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
	},
	
	/************************* BELOW MOVED FROM DECORATOR **********************/
	
	_getNode: function(n) {
		return this.$.generator.fetchRowNode(n);
	},

	_focusItem: function(n, bScrollIntoView) {
		if (!enyo.exists(n) || n === null) { n = 0; }

		var oNode = this._getNode(n);
		enyo.Spotlight.Util.addClass(oNode, 'spotlight');

		if (bScrollIntoView && oNode && !this._isInView(oNode)) {
			if (this.animateToNode) {
				this.animateToNode(oNode, true);
			} else {
				this.scrollIntoView({
					hasNode : function() { return true; },
					oNode    : this._getNode(n)
				}, false);
			}
		}
	},

	_blurItem: function(n) {
		if (!enyo.exists(n) || n === null) { n = this.getCurrent(); }
		enyo.Spotlight.Util.removeClass(this._getNode(n), 'spotlight');
		enyo.Spotlight.Util.removeClass(this.node, 'spotlight');
	},

	_unspot: function() {
		this.setCurrent(null, true);
	},

	_itemExists: function(n) {
		return n >= 0 && n < this.getCount();
	},

	_spotNextItem: function() {
		var nNext = this.getCurrent() + 1;

		if (this._itemExists(nNext)) {
			this.setCurrent(nNext, true);
			return true;
		} else {
			this._unspot();
		}
	},

	_spotPreviousItem: function() {
		var nPrev = this.getCurrent() - 1;

		if (this._itemExists(nPrev)) {
			this.setCurrent(nPrev, true);
			return true;
		} else {
			this._unspot();
		}
	},

	//replacement ScrollStrategy function to address the offsets in List where a paging strategy is used
	_isInView: function(inNode) {
		var sb = this.getScrollBounds();
		var ot = inNode.offsetTop + inNode.offsetParent.offsetTop;
		var oh = inNode.offsetHeight;
		var ol = inNode.offsetLeft + inNode.offsetParent.offsetLeft;
		var ow = inNode.offsetWidth;
		return (ot >= sb.top && ot + oh <= sb.top + sb.clientHeight) && (ol >= sb.left && ol + ow <= sb.left + sb.clientWidth);
	},

	/******************************/

	onSpotlightFocus: function(oSender, oEvent) {
		this.setCurrent(this.getCurrent(), false);
	},

	onSpotlightBlur: function(oSender, oEvent) {
		this._unspot();
	},

	onSpotlightSelect: function(oSender, oEvent) {
		var nCurrent = this.getCurrent();
		enyo.Spotlight.Util.dispatchEvent('ontap', {index: nCurrent}, this.children[nCurrent]);
		return true;
	},

	onSpotlightDown: function(oSender, oEvent) {
		if (this.getOrient && this.getOrient() === 'h') {
			this._unspot();
		} else {
			return this._spotNextItem();
		}
	},

	onSpotlightUp: function(oSender, oEvent) {
		if (this.getOrient && this.getOrient() === 'h') {
			this._unspot();
		} else {
			return this._spotPreviousItem();
		}
	},

	onSpotlightLeft: function(oSender, oEvent) {
		if (this.getOrient && this.getOrient() === 'h') {
			return this.rtl ? this._spotNextItem() : this._spotPreviousItem();
		} else {
			this._unspot();
		}
	},

	onSpotlightRight: function(oSender, oEvent) {
		if (this.getOrient && this.getOrient() === 'h') {
			return this.rtl ? this._spotPreviousItem() : this._spotNextItem();
		} else {
			this._unspot();
		}
	},

	onMove: function(oSender, oEvent) {
		this.setCurrent(oEvent.index, false);
		return true;
	},

	getCurrent: function() {
		return enyo.exists(this._nCurrentSpotlightItem)
			? this._nCurrentSpotlightItem
			: 0;
	},

	setCurrent: function(n, bScrollIntoView) {
		bScrollIntoView = bScrollIntoView || false;

		if (!enyo.exists(n)) { n = null; }
		if (!this._itemExists(n)) { return; }

		this._blurItem(null);
		if (n !== null) {                             // Navigating within list - blur current and spot another
			this._focusItem(n, bScrollIntoView);
			this._nCurrentSpotlightItem = n;
			enyo.Spotlight.Util.dispatchEvent('onSpotlightItemFocus', {index: n}, this);
		}
	}
});