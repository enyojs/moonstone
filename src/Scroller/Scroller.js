require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Scroller~Scroller}
* kind. On platforms with touch support, it will return
* {@link module:enyo/Scroller~Scroller}.
* @module moonstone/Scroller
*/

var
	kind = require('enyo/kind'),
	platform = require('enyo/platform'),
	Scroller = require('enyo/Scroller'),
	Signals = require('enyo/Signals');

var
	Spotlight = require('spotlight');

var
	ScrollStrategy = require('../ScrollStrategy');

/**
* On touch platforms, revert to using Enyo scroller, which picks an appropriate
* scroll strategy for the given platform.
*
* @private
*/
if (platform.touch) {
	module.exports = Scroller;
} else {
	/**
	* Fires when a control explicitly requests to be scrolled into view. Handled by the 
	* [scroll strategy]{@link module:enyo/Scroller~Scroller#strategyKind}.
	*
	* @event enyo.Scroller#onRequestScrollIntoView
	* @type {Object}
	* @property {Boolean} scrollInPointerMode - Whether to allow scrolling in pointer mode.
	* @property {Boolean} scrollFullPage - If defined, overrides the scroller's
	*	[scrollFullPage]{@link module:moonstone/Scroller~Scroller#scrollFullPage} property.
	* @public
	*/

	/**
	* {@link module:moonstone/Scroller~Scroller} extends {@link module:enyo/Scroller~Scroller}, adding support for 5-way focus
	* (Spotlight) and pagination buttons.
	*
	* It responds when controls explicitly request to be scrolled into view by emitting the
	* [onRequestScrollIntoView]{@link module:enyo/Scroller~Scroller#onRequestScrollIntoView} event. This
	* typically happens when a control handles an `onSpotlightFocused` event, ensuring that
	* 5-way ({@glossary Spotlight}) focused controls remain in view.
	*
	* For more information, see the documentation on
	* [Scrollers]{@linkplain $dev-guide/building-apps/layout/scrollers.html} in the
	* Enyo Developer Guide.
	*
	* @class Scroller
	* @extends module:enyo/Scroller~Scroller
	* @ui
	* @public
	*/
	module.exports = kind(
		/** @lends module:moonstone/Scroller~Scroller.prototype */ {

		/**
		* @private
		*/
		name:      'moon.Scroller',

		/**
		* @private
		*/
		kind:      Scroller,

		/**
		* @private
		* @lends module:moonstone/Scroller~Scroller.prototype
		*/
		published: {

			/**
			* If `true`, when scrolling to focused child controls, the scroller will
			* scroll as far as possible, until its edge meets the next item's edge.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			scrollFullPage: false,

			/**
			* If `true`, paging controls are focusable (in 5-way mode).  Normally, this
			* is not required, since the scroller will automatically scroll to ensure
			* most focusable items are in view.  It is intended to be used when the
			* scroller contents have no spotlightable controls, such as the case of a
			* scroller with a long body of text.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			spotlightPagingControls: false,

			/**
			* If 'true', paging controls are hidden when content fit in scroller
			* even when spotlightPagingControls is true.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			hideScrollColumnsWhenFit: false,

			/**
			* Relative parameter used to determine scroll speed.
			*
			* @type {Number}
			* @default 75
			* @public
			*/
			scrollInterval: 75,

			/**
			* The ratio of mousewheel 'delta' units to pixels scrolled. Increase this
			* value to increase the distance scrolled by the scroll wheel. Note that
			* mice/trackpads do not emit the same 'delta' units per 'notch' or flick of
			* the scroll wheel/trackpad; that can vary based on intensity and momentum.
			*
			*
			* @type {Number}
			* @default 2
			* @public
			*/
			scrollWheelMultiplier: 2,

			/**
			* The ratio of the maximum distance scrolled by each scroll wheel event to
			* the height/width of the viewport. Setting a value larger than `1` is not
			* advised, since a single scroll event could move more than one viewport's
			* worth of content (depending on the delta received), resulting in skipped
			* content.
			*
			* @type {Number}
			* @default 0.2
			* @public
			*/
			scrollWheelPageMultiplier: 0.2,

			/**
			* The ratio of the distance scrolled per tap of the paging button to the
			* height/width of the viewport. Setting a value larger than `1` is not
			* advised, since a paging button tap will move more than one viewport's
			* worth of content, resulting in skipped content.
			*
			*
			* @type {Number}
			* @default 0.8
			* @public
			*/
			paginationPageMultiplier: 0.8,

			/**
			* The ratio of continuous-scrolling delta units to pixels scrolled. Increase
			* this value to increase the distance scrolled when the pagination buttons
			* are held.
			*
			* @type {Number}
			* @default 8
			* @public
			*/
			paginationScrollMultiplier: 8,

			/**
			* When `true`, the scroll wheel moves spotlight focus up/down through the
			* scroller when in 5-way mode. (In pointer mode, the scroll wheel always
			* scrolls the viewport without modifying focus position.) When `false`, the
			* scroll wheel works the same in 5-way mode as in pointer mode, where the
			* wheel moves the position of the scroller viewport.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			scrollWheelMovesFocus: true
		},

		/**
		* @private
		*/
		handlers: {
			onSpotlightScrollUp:'spotlightWheel',
			onSpotlightScrollDown:'spotlightWheel',
			onSpotlightContainerEnter:'enablePageUpDownKey',
			onSpotlightContainerLeave:'disablePageUpDownKey',
			onenter:'enablePageUpDownKey',
			onleave:'disablePageUpDownKey',
			onmove:'move'
		},

		/**
		* @private
		*/
		decorateEvent: function (nom, event, sender) {
			this.inherited(arguments);
			if (this.spotlightPrecedence && nom.indexOf('onSpotlight') > -1) {
				event.spotlightPrecedence = this.spotlightPrecedence;
			}
		},

		/**
		* If `true`, scroll events are not allowed to propagate.
		*
		* @private
		*/
		preventScrollPropagation: false,

		/**
		* If `true`, measure the size of the scroll columns on initial render.
		* See {@link module:moonstone/ScrollStrategy~ScrollStrategy#_measureScrollColumns} for details.
		*
		* @private
		*/
		measureScrollColumns: false,

		/**
		* Default to {@link module:moonstone/ScrollStrategy~ScrollStrategy}
		*
		* @private
		*/
		strategyKind: ScrollStrategy,

		/**
		* @private
		*/
		spotlight: 'container',

		/**
		* @private
		*/
		handlePageUpDownKey: false,

		/**
		* Scrolls until the specified [control]{@link module:enyo/Control~Control} is in view. If
		* `scrollFullPage` is set, scrolls until the edge of `control` is aligned with
		* the edge of the visible scroll area. Optional third parameter indicates
		* whether or not the scroll should be animated. If `setLastFocusedChild` is
		* `true`, scroller will set up `control` to be the spotted child when the
		* scroller is spotted.
		*
		* @param {Object} control - The [control]{@link module:enyo/Control~Control} to scroll into view.
		* @param {Boolean} [scrollFullPage] - If `true`, scrolls until the edge of `control`
		* is aligned with the edge of the visible scroll area. If `undefined`, the value in
		*	[scrollFullPage]{@link module:moonstone/Scroller~Scroller#scrollFullPage} is used.
		* @param {Boolean} [animate=true] - If `true`, animates the scroll.
		* @param {Boolean} [setLastFocusedChild=false] - If `true`, scroller will set up
		* `control` to be the spotted child when the scroller is spotted.
		* @public
		*/
		scrollToControl: function (control, scrollFullPage, animate, setLastFocusedChild) {
			if (setLastFocusedChild) {
				this.setLastFocusedChild(control);
			}
			this.$.strategy.animateToControl(control, scrollFullPage, animate);
		},

		/**
		* Scrolls to the specified `x` and `y` coordinates. The optional third parameter
		* may be set to `false` to disable animation for the scroll.
		*
		* @param {Number} x - Horizontal position in pixels
		* @param {Number} y - Vertical position in pixels
		* @param {Boolean} [animate=true] - If `true`, animates the scroll.
		* @public
		*/
		scrollTo: function (x, y, animate) {
			this.$.strategy.scrollTo(x, y, animate);
		},

		/**
		* @private
		*/
		bindings: [
			{from: '.scrollInterval',				to:'.$.strategy.interval'},
			{from: '.scrollWheelMultiplier',		to:'.$.strategy.scrollWheelMultiplier'},
			{from: '.scrollWheelPageMultiplier',	to:'.$.strategy.scrollWheelPageMultiplier'},
			{from: '.paginationPageMultiplier',		to:'.$.strategy.paginationPageMultiplier'},
			{from: '.paginationScrollMultiplier',	to:'.$.strategy.paginationScrollMultiplier'},
			{from: '.hideScrollColumnsWhenFit',		to:'.$.strategy.hideScrollColumnsWhenFit'}
		],

		/**
		* @private
		*/
		create: function () {
			Scroller.prototype.create.apply(this, arguments);
			this.spotlightPagingControlsChanged();
			this.scrollWheelMovesFocusChanged();
			this.createChrome([{kind: Signals, onkeyup: 'keyup'}]);

			this.$.strategy.measureScrollColumns = this.measureScrollColumns;

			// workaround because the bootstrapping code isn't attached to constructors that have
			// finished setup before the hook is declared
			if(Spotlight && this.spotlight === 'container') {
				Spotlight.Container.initContainer(this);
			}
		},

		/**
		* @private
		*/
		setLastFocusedChild: function(control) {
			Spotlight.Container.setLastFocusedChild(this, control);
		},

		/**
		* @private
		*/
		spotlightPagingControlsChanged: function () {
			this.$.strategy.set('spotlightPagingControls', this.spotlightPagingControls);
		},

		/**
		* @private
		*/
		scrollWheelMovesFocusChanged: function () {
			if (!this.scrollWheelMovesFocus) {
				this.setUseMouseWheel(true);
			}
		},

		/**
		* @private
		*/
		spotlightWheel: function (inSender, inEvent) {
			if (this.scrollWheelMovesFocus) {
				if (!Spotlight.getPointerMode()) {
					var curr = Spotlight.getCurrent();
					if (curr && curr.isDescendantOf(this)) {
						var dir = inEvent.type == 'onSpotlightScrollUp' ? 'onSpotlightUp' : 'onSpotlightDown';
						this._spotlightModal = this.spotlightModal;
						this.spotlightModal = true;	// Trap focus inside scroller while wheeling
						Spotlight.Util.dispatchEvent(dir, {type: dir}, curr);
						this.spotlightModal = this._spotlightModal;
						return true;
					}
				}
			}
		},

		/**
		* @private
		*/
		getHandlePageUpDownKey: function () {
			return this.handlePageUpDownKey;
		},

		/**
		* @private
		*/
		enablePageUpDownKey: function () {
			this.handlePageUpDownKey = true;
		},

		/**
		* @private
		*/
		disablePageUpDownKey: function () {
			this.handlePageUpDownKey = false;
		},

		/**
		* @private
		*/
		move: function (inSender, inEvent) {
			if (!this.getHandlePageUpDownKey()) {
				this.enablePageUpDownKey();
			}
		},

		/**
		* @private
		*/
		keyup: function (inSender, inEvent) {
			var KEY_POINTER_PAGE_UP = 33,
				KEY_POINTER_PAGE_DOWN = 34;

			if (!this.getHandlePageUpDownKey()) {
				return;
			}

			var strategy = this.getStrategy(),
				showVertical = strategy.showVertical(),
				viewportBounds = strategy.$.viewport.getAbsoluteBounds(),
				oSpotControl = Spotlight.getCurrent(),
				direction,
				rDirection,
				pageKeyCtr;

			switch (inEvent.keyCode) {
				case KEY_POINTER_PAGE_UP:
					direction = showVertical ? 'Up' : 'Left';
					rDirection = showVertical ? 'Down' : 'Right';
					break;
				case KEY_POINTER_PAGE_DOWN:
					direction = showVertical ? 'Down' : 'Right';
					rDirection = showVertical ? 'Up' : 'Left';
					break;
				default:
					return;
			}

			pageKeyCtr = strategy.$['page' + direction + 'Control'];

			if (!Spotlight.getPointerMode() && oSpotControl) {
				var oSpotBounds = oSpotControl.getAbsoluteBounds(),
					oEndPoint = this.getEndPoint(direction, oSpotBounds, viewportBounds);

				var oControl = Spotlight.
								NearestNeighbor.
								getNearestPointerNeighbor(this, rDirection.toUpperCase(), oEndPoint.x, oEndPoint.y);
				if (oControl && oControl.id === oSpotControl.id) {
					oEndPoint = this.getEndPoint(direction, oSpotBounds, this.getNextViewport(direction, viewportBounds));
					oControl = Spotlight.
								NearestNeighbor.
								getNearestPointerNeighbor(this, rDirection.toUpperCase(), oEndPoint.x, oEndPoint.y);
				}
				if (oControl !== oSpotControl) {
					Spotlight.spot(oControl);
				} else {
					pageKeyCtr.sendPaginateEvent();
				}
			}
			else {
				if (pageKeyCtr.getDisabled()) {
					strategy.alertThumbs();
				} else {
					pageKeyCtr.sendPaginateEvent();
				}
			} 
		},

		/**
		* @private
		*/
		getEndPoint: function (direction, oSpotBounds, viewportBounds) {
			var oPoint = {};
			switch (direction) {
				case 'Up':
					oPoint.x = oSpotBounds.left + oSpotBounds.width/2;
					oPoint.y = viewportBounds.top;
					break;
				case 'Left':
					oPoint.x = viewportBounds.left;
					oPoint.y = oSpotBounds.top + oSpotBounds.height/2;
					break;
				case 'Down':
					oPoint.x = oSpotBounds.left + oSpotBounds.width/2;
					oPoint.y = viewportBounds.top + viewportBounds.height;
					break;
				case 'Right':
					oPoint.x = viewportBounds.left + viewportBounds.width;
					oPoint.y = oSpotBounds.top + oSpotBounds.height/2;
					break;
			}
			return oPoint;
		},

		/**
		* @private
		*/
		getNextViewport: function (direction, viewportBounds) {
			switch (direction) {
				case 'Up':
					viewportBounds.top = viewportBounds.top - viewportBounds.height;
					return viewportBounds;
				case 'Left':
					viewportBounds.left = viewportBounds.left - viewportBounds.width;
					return viewportBounds;
				case 'Down':
					viewportBounds.top = viewportBounds.top + viewportBounds.height;
					return viewportBounds;
				case 'Right':
					viewportBounds.left = viewportBounds.left + viewportBounds.width;
					return viewportBounds;
			}
		},

		/**
		* @private
		*/
		previewDomEvent: function (inEvent) {
			if (this.scrollWheelMovesFocus) {
				if (inEvent.type == 'mousewheel') {
					this.setUseMouseWheel(Spotlight.getPointerMode());
				}
			}
		}
	});
}
