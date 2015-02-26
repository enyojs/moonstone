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
		initContainer: enyo.inherit(function (sup) {
			return function() {
				// Our delegate relies on scroll column metrics, so we
				// need to ask the scroller to measure the columns for us
				this.scrollerOptions.measureScrollColumns = true;
				sup.apply(this, arguments);
			};
		}),

		/**
		* @private
		*/
		constructor: enyo.inherit(function (sup) {
			return function () {
				sup.apply(this, arguments);

				// scale px values for current resolution
				this.spacing = moon.ri.scale(this.spacing);
				this.minWidth = moon.ri.scale(this.minWidth);
				this.minHeight = moon.ri.scale(this.minHeight);
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
			* Overriding refresh() to resize scroller and stop scrolling.
			*
			* @method
			* @private
			*/
			refresh: enyo.inherit(function (sup) {
				return function (list) {
					sup.apply(this, arguments);
					list.$.scroller.stop();
				};
			}),

			/**
			* Overriding scrollToControl() to specify Moonstone-specific scroller options.
			* No need to call the super method, so we don't wrap in enyo.inherit().
			*
			* @method
			* @private
			*/
			scrollToControl: function(list, control) {
				list.$.scroller.scrollToControl(control, false, false, true);
			},

			/**
			* Overriding scrollTo() to specify Moonstone-specific scroller options.
			* No need to call the super method, so we don't wrap in enyo.inherit().
			*
			* @method
			* @private
			*/
			scrollTo: function(list, x, y) {
				list.$.scroller.scrollTo(x, y, false);
			},

			/**
			* moon.ScrollStrategy dynamically shows / hides scroll controls
			* depending on whether there's enough content to scroll. It also
			* "steals" space from the scrollable content area to make room
			* for the controls. This means we need to calculate whether scroll
			* controls will be required before generating list pages so that we
			* can adjust our metrics accordingly.
			*
			* We do this by overriding the width() method, so that we can
			* subtract the width of the scroll column in cases where we
			* calculate that we'll need to scroll.
			*
			* @method
			* @private
			*/
			width: enyo.inherit(function (sup) {
				return function (list) {
					var w = sup.apply(this, arguments),
						s = list.$.scroller,
						v = s.getVertical(),
						a, b, r, h;
					if (s.spotlightPagingControls) {
						a = true;
					}
					else if (v === 'auto') {
						b = s.getScrollBounds();
						this.calculateMetrics(list, w);
						r = Math.ceil(list.collection.length / list.columns);
						h = r * this.childSize(list);
						a = (h > b.clientHeight);
					}
					else {
						a = (v === 'scroll');
					}
					if (a) {
						w = w - moon.ScrollStrategy.vScrollColumnSize;
						this.calculateMetrics(list, w);
					}
					return w;
				};
			})
		}, true);
	})(enyo, moon);
})(enyo, this);
