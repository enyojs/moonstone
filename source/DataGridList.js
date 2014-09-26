(function (enyo, scope) {
	/**
	* {@link moon.DataGridList} is an {@link enyo.DataGridList} with Moonstone visual
	* styling applied.
	*
	* @class moon.DataGridList
	* @extends enyo.DataGridList
	* @mixes moon.DataListSpotlightSupport
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.DataGridList.prototype */ {

		/**
		* @private
		*/
		name: 'moon.DataGridList',

		/**
		* @private
		*/
		kind: 'enyo.DataGridList',

		/**
		* @private
		*/
		mixins: ['moon.DataListSpotlightSupport'],

		/**
		* @private
		*/
		noDefer: true,

		/**
		* @private
		*/
		allowTransitions: false,

		/**
		* @private
		*/
		spotlight: true,

		/**
		* @private
		*/
		scrollerOptions: { kind: 'moon.Scroller', vertical:'scroll', horizontal: 'hidden' },

		/**
		* @private
		*/
		handlers: {
			onSpotlightFocus   : 'handleSpotlightFocus',
			onSpotlightBlur    : 'handleSpotlightBlur',
			onSpotlightFocused : 'handleSpotlightFocused'
		},

		/**
		* @private
		*/
		handleSpotlightFocus: function (inSender, inEvent) {
			var c = inEvent.originator;
			if(c !== this.$.scroller) {
				var zIndex = parseInt(enyo.dom.getComputedStyleValue(c.hasNode(), 'z-index'), 10) || 0;
				c.applyStyle('z-index', zIndex + 1);
			}
		},

		/**
		* @private
		*/
		handleSpotlightBlur: function (inSender, inEvent) {
			var c = inEvent.originator;
			if(c !== this.$.scroller) {
				setTimeout(this.bindSafely(function () {
					c.applyStyle('z-index', null);
				}), 0);
			}
		},

		/**
		* @private
		*/
		handleSpotlightFocused: function (inSender, inEvent) {
			if (!enyo.Spotlight.getPointerMode()) {
				if (inEvent.index < this.indexBoundFirstRow) {
					this.$.scroller.scrollToTop();
				} else if (inEvent.index > this.indexBoundLastRow) {
					this.$.scroller.scrollToBottom();
				}
			}
		}
	});

	/**
	* Overload the delegate strategy to incorporate measurements for our scrollers
	* when they are visible.
	*
	* @private
	*/
	(function (enyo, moon) {
		var p = moon.DataGridList.delegates.verticalGrid = enyo.clone(enyo.DataGridList.delegates.verticalGrid);
		enyo.kind.extendMethods(p, {

			/**
			* @method
			* @private
			*/
			refresh: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					list.$.scroller.resize();
				};
			}),

			/**
			* @private
			*/
			scrollToIndex: function (list, i) {
				// This function recurses, so make sure we are scrolling to a valid index,
				// otherwise childForIndex will never return a control
				if ((i < 0) || (i >= list.collection.length)) {
					return;
				}
					// first see if the child is already available to scroll to
				var c = this.childForIndex(list, i),
					// but we also need the page so we can find its position
					p = this.pageForIndex(list, i);
				// if there is no page then the index is bad
				if (p < 0 || p > this.pageCount(list)) { return; }
				// if there isn't one, then we know we need to go ahead and
				// update, otherwise we should be able to use the scroller's
				// own methods to find it
				if (c) {
					// force a synchronous scroll to the control so it won't dupe and
					// re-animate over positions it has already crossed
					list.$.scroller.scrollToControl(c, false, false);
				} else {
					var idx = list.$.page1.index;

					// attempting to line them up in a useful order
					// given the direction from where our current index is
					if (idx < p) {
						list.$.page1.index = p - 1;
						list.$.page2.index = p;
					} else {
						list.$.page1.index = p;
						list.$.page2.index = p + 1;
					}
					list.refresh();

					this.scrollToIndex(list, i);
				}
			},

			/**
			* @method
			* @private
			*/
			reset: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					this.updateMetrics(list);
					list.refresh();
					list.$.scroller.scrollTo(0, 0, false);
				};
			}),

			/**
			* @method
			* @private
			*/
			updateBounds: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					var w = list.boundsCache.width,
						b = list.$.scroller.getScrollBounds(),
						v = list.$.scroller.$.strategy.$.vColumn,
						c = list.$.scroller.$.strategy.$.clientContainer;
					if (v && (list.$.scroller.getVertical() == 'scroll' || (b.height > b.clientHeight))) {
						var cs = enyo.dom.getComputedStyle(c.hasNode());
						list.boundsCache.width = w - (parseInt(cs['padding-right'], 10) + parseInt(cs['padding-left'], 10));
					}
				};
			})
		}, true);
	})(enyo, moon);
})(enyo, this);
