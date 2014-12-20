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
		constructor: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				// scale px values for current resolution
				this.spacing = moon.riScale(this.spacing);
				this.minWidth = moon.riScale(this.minWidth);
				this.minHeight = moon.riScale(this.minHeight);
			};
		}),

		/**
		* @private
		*/
		handleSpotlightFocus: function (inSender, inEvent) {
			var c = inEvent.originator;
			var isClientControl = this.getClientControls().indexOf(c) >= 0;
			if(isClientControl) {
				var zIndex = parseInt(enyo.dom.getComputedStyleValue(c.hasNode(), 'z-index'), 10) || 0;
				c.applyStyle('z-index', zIndex + 1);
			}
		},

		/**
		* @private
		*/
		handleSpotlightBlur: function (inSender, inEvent) {
			var c = inEvent.originator;
			var isClientControl = this.getClientControls().indexOf(c) >= 0;
			if(isClientControl) {
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
			* Overriding scrollToControl() to specify Moonstone-specific scroller options.
			* No need to call the super method, so we don't wrap in enyo.inherit().
			*
			* @private
			*/
			scrollToControl: function(list, control) {
				list.$.scroller.scrollToControl(control, false, false, true);
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
