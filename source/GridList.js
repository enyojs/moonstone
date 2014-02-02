/**
	_moon.GridList_ extends [enyo.GridList](#enyo.GridList), adding
	Moonstone-specific configuration, styling, decorators, and
	Spotlight/focus-state management.

		enyo.kind({
			...
			components: [
						{
					kind: "moon.GridList",
					onSetupItem: "setupItem",
					toggleSelected: true,
						components: [
							{name: "item", kind: "moon.GridListImageItem"}
						]
					}
			],
			...
			results: [],
			setupItem: function(inSender, inEvent) {
				var i = inEvent.index;
				var item = this.results[i];
				this.$.item.setSource(item.BoxArt.LargeUrl);
				this.$.item.setCaption(item.Name);
				this.$.item.setSelected(this.$.gridlist.isSelected(i));
			},
			...
		});
*/

enyo.kind({
	name : "moon.GridList",
	kind : "enyo.GridList",
	
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
	events: {
		ontap: "tap"
	},
	
	//* @protected
	classes           : "moon-gridlist",
	spotlight         : true,
	spotlightDecorate : false,
	itemSpacing       : 64,
	itemMinWidth      : 180,
	itemMinHeight     : 180,
	itemWidth         : 180,
	itemHeight        : 180,
	itemFluidWidth    : true,
	strategyKind      : "moon.ScrollStrategy",
	
	initComponents: function() {
		// enyo.Spotlight.Decorator.GridList will not find flyweighted nodes properly
		// if spotlight is applied on any template controls
		this._removeSpotlight(this.components);
		// Create a dummy component to dynamically compute the dimensions of items at runtime (once for each item during sizeupItem) based on the actual content inside the item (only for variable sized items where sizeupItem is called).
		this.createComponent({name: "_dummy_", allowHtml: true, classes: "enyo-gridlist-dummy", showing: false}, {owner: this});
		this.inherited(arguments);
	},
	_removeSpotlight: function (components) {
		for (var i=0; i<components.length; i++) {
			var c = components[i];
			c.spotlight = false;
			if (c.components) {
				this._removeSpotlight(c.components);
			}
		}
	},
	tap: function(inSender, inEvent) {
		enyo.Spotlight.spot(this);
	},
	//* Override to account for scrollbars in moon.ScrollStrategy.
	_calculateItemsPerRow: function() {
		var n = this.$.strategy.$.clientContainer.hasNode();
		if (n) {
			this.itemsPerRow = Math.floor((n.clientWidth - this.itemSpacing)/(this.itemMinWidth + this.itemSpacing));
			var visibleRows = Math.round((n.clientHeight - this.itemSpacing)/(this.itemMinHeight + this.itemSpacing));
			if (this.itemFixedSize || this.itemFluidWidth) {
				var itemsPerRow = Math.floor((n.clientWidth - this.itemSpacing)/(this.itemWidth + this.itemSpacing));
				var low = Math.floor(itemsPerRow);
				var high = Math.ceil(itemsPerRow);
				var gutter = n.clientWidth - this.itemSpacing - (high * (this.itemWidth + this.itemSpacing));
				this.itemsPerRow = (gutter > 0) ? high : low;
				visibleRows = Math.round((n.clientHeight - this.itemSpacing)/(this.itemHeight + this.itemSpacing));
			}
			// Make sure there's at least 1 item per row
			this.itemsPerRow = Math.max(1, this.itemsPerRow);
			this.rowsPerPage = 3 * this.itemsPerRow * visibleRows;
			this.$.generator.itemsPerRow = this.itemsPerRow;
		}
	},
	//* Override to use _moon.GridFlyWeightRepeater_
	_setComponents: function() {
		// TODO: The entire implementation of GridList needs an overhaul, but for now this ugly cloning is
		// needed to prevent the generator kind modification below from modifying enyo.Lists's generator
		this.listTools = enyo.clone(this.listTools);
		this.listTools[0] = enyo.clone(this.listTools[0]);
		this.listTools[0].components = enyo.clone(this.listTools[0].components);
		var c = this.listTools[0].components;
		// Override List's listTools array to use GridFlyweightRepeater instead of FlyweightRepeater
		for (var i=0; i<c.length; i++) {
			if (c[i].name == 'generator') {
				c[i] = enyo.clone(c[i]);
				c[i].kind = "moon.GridFlyWeightRepeater";
				return;
			}
		}
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
			n = inNode,
			marginExtents;

		if(!st.scrollNode) {
			return;
		}

		while (n && n.parentNode && n.id != st.scrollNode.id) {
			marginExtents = enyo.dom.calcMarginExtents(n);
			b.top += n.offsetTop - marginExtents.top + marginExtents.bottom;
			b.left += n.offsetLeft - marginExtents.left + marginExtents.right;
			n = n.offsetParent;
		}

		var xDir = (this.isInViewX(inNode)) ? 0 : b.left - sb.left > 0 ? 1 : b.left - sb.left < 0 ? -1 : 0;
		var yDir = (this.isInViewY(inNode)) ? 0 : b.top - sb.top > 0 ? 1 : b.top - sb.top < 0 ? -1 : 0;

		var y = (yDir === 0) ? sb.top :
			(inLazy)
				?   (yDir === 1)
					?   b.top + b.height - sb.clientHeight
					:   b.top
				:   Math.min(sb.maxTop, b.top);

		var x = (xDir === 0) ? sb.left :
			(inLazy)
				?   (xDir === 1)
					?   b.left + b.width - sb.clientWidth
					:   b.left
				:   Math.min(sb.maxLeft, b.left);

		// If x or y changed, scroll to new position
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x,y);
		}
	},
	isInViewX: function(inNode) {
		var sb = this.getScrollBounds();
		var ol = inNode.offsetLeft;
		var ow = inNode.offsetWidth;
		return (ol >= sb.left && ol + ow <= sb.left + sb.clientWidth);
	},
	isInViewY: function(inNode) {
		var sb = this.getScrollBounds();
		var ot = inNode.offsetTop;
		var oh = inNode.offsetHeight;
		return (ot >= sb.top && ot + oh <= sb.top + sb.clientHeight);
	},
	
	/************************* BELOW MOVED FROM DECORATOR **********************/
	
	_getNodeParent: function(n) {
		if (this.$.generator.hasNode()) {
			return this.$.generator.node.querySelector('[data-enyo-index="' + n + '"]');
		}
	},

	_getNode: function(n) {
		if (this.$.generator.hasNode()) {
			return this.$.generator.node.querySelector('[data-enyo-index="' + n + '"] > .moon-gridlist-item');
		}
	},

	_focusNode: function(n) {
		enyo.Spotlight.Util.addClass(this._getNode(n), 'spotlight');
	},

	_blurNode: function(n) {
		enyo.Spotlight.Util.removeClass(this._getNode(n), 'spotlight');
	},

	/******************************/

	onSpotlightFocus: function(oSender, oEvent) {
		this.setCurrent(this.getCurrent(), false);
		enyo.Spotlight.Util.removeClass(this.node, 'spotlight');
	},

	onSpotlightBlur: function(oSender, oEvent) {
		this.setCurrent(null, true);
		enyo.Spotlight.Util.removeClass(this.node, 'spotlight');
	},

	onSpotlightSelect: function(oSender, oEvent) {
		if (this.getCurrent() !== null) {
			this.$.generator.$.selection.bubble("ontap", {index: this.getCurrent()});
			this.setCurrent(this.getCurrent(), true);
		} else {
			this.setCurrent(0, true);
		}
		enyo.Spotlight.Util.removeClass(this.node, 'spotlight');
		return true;
	},

	onSpotlightDown: function(oSender, oEvent) {
		//Jump one row down (increment index by itemsPerRow)
		var nCurrent = this.getCurrent();
		if (nCurrent === null) { return true; }
		var nNew = nCurrent + this.itemsPerRow;
		if (nNew <= this.getCount() - 1) {
			this.setCurrent(nNew, true);
			return true;
		}
		this.setCurrent(null, true);
	},

	onSpotlightUp: function(oSender, oEvent) {
		//Jump one row up (decrement index by itemsPerRow)
		var nCurrent = this.getCurrent();
		if (nCurrent === null) { return true; }
		var nNew = nCurrent - this.itemsPerRow;
		if (nNew >= 0) {
			this.setCurrent(nNew, true);
			return true;
		}
		this.setCurrent(null, true);
	},

	onSpotlightLeft: function(oSender, oEvent) {
		var nCurrent = this.getCurrent();
		if (nCurrent === null) { return true; }
		if (nCurrent > 0) {
			this.setCurrent(nCurrent - 1, true);
			return true;
		}
		this.setCurrent(null, true);
	},

	onSpotlightRight: function(oSender, oEvent) {
		var nCurrent = this.getCurrent();
		if (nCurrent === null) { return true; }
		if (nCurrent < this.getCount() - 1 && nCurrent + 1 >= 0) {
			this.setCurrent(nCurrent + 1, true);
			return true;
		}
		this.setCurrent(null, true);
	},

	onMove: function(oSender, oEvent) {
		this.setCurrent(oEvent.index);
	},

	getCurrent: function() {
		if (typeof this._nCurrentSpotlightItem == 'undefined') {
			if(enyo.Spotlight.getPointerMode()){
				return 0 - this.itemsPerRow;
			} else {
				return 0;
			}
		}
		return this._nCurrentSpotlightItem;
	},

	setCurrent: function(n, bScrollIntoView) {
		var nCurrent = this.getCurrent();

		if (nCurrent !== null) {
			this._blurNode(nCurrent);
		}

		if (n !== null) {
			this._focusNode(n);
			this._nCurrentSpotlightItem = n;
			if (bScrollIntoView) {
				var nd = this._getNodeParent(n);
				if (!this.$.strategy.isInView(nd)) {
					this.animateToNode(nd, true);
				}
			}
			enyo.Spotlight.Util.dispatchEvent('onSpotlightItemFocus', {index: n}, this);
		}
		enyo.Spotlight.Util.removeClass(this.node, 'spotlight');
	}
});