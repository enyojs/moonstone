(function (enyo, scope) {
	/**
	* Fired when a control explicitly requests to be scrolled into view. Handled by the 
	* [scroll strategy]{@link enyo.Scroller#strategyKind}.
	*
	* @event enyo.Scroller#onRequestScrollIntoView
	* @type {Object}
	* @property {Boolean} scrollInPointerMode - `true` to scroll in pointer mode
	* @property {Boolean} scrollFullPage - If defined, overrides the scroller's
	*	[`scrollFullPage`]{@link moon.Scroller#scrollFullPage} property.
	* @public
	*/

	/**
	* `moon.Scroller` extends [enyo.Scroller]{@link enyo.Scroller}, adding support for 5-way focus
	* (Spotlight) and pagination buttons.
	*
	* It responds when controls explicitly request to be scrolled into view by emitting the
	* [`onRequestScrollIntoView`]{@link moon.Scroller#event:onRequestScrollIntoView} event. This
	* typically happens when a control handles an
	* [`onSpotlightFocused`]{@link Spotlight:event#onSpotlightFocused} event, ensuring that 5-way
	* ({@glossary Spotlight}) focused controls remain in view.
	*
	* For more information, see the documentation on
	* [Scrollers](building-apps/layout/scrollers.html) in the Enyo Developer Guide.
	*
	* @class moon.Scroller
	* @extends enyo.Scroller
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends moon.Scroller.prototype */ {

		/**
		* @private
		*/
		name:      'moon.Scroller',

		/**
		* @private
		*/
		kind:      'enyo.Scroller',

		/**
		* @private
		* @lends moon.Scroller.prototype
		*/
		published: {

			/**
			* If `true`, when scrolling to focused child controls, the scroller will
			* scroll as far as possible, until its edge meets the next item's edge
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
			* Relative parameter used to determine scroll speed
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
			onSpotlightContainerEnter: 'spotlightHello',
			onSpotlightFocus: 'spotlightHello',
			onSpotlightContainerLeave: 'spotlightGoodbye'
		},

		/**
		* If `true`, scroll events are not allowed to propagate
		*
		* @private
		*/
		preventScrollPropagation: false,

		/**
		* Default to {@link moon.ScrollStrategy}
		*
		* @private
		*/
		strategyKind: 'moon.ScrollStrategy',

		/**
		* Scrolls until `control` is in view. If `scrollFullPage` is set, scrolls
		* until the edge of `control` is aligned with the edge of the visible scroll
		* area. Optional third parameter to indicate whether or not it should animate
		* the scroll. Defaults to animation unless it is set to `false`.
		* If `setLastFocusedChild` is `true`, scroller will set up `control` to be the spotted child
		* when scroller is spotted.
		*
		* @param {Object} control - The control to scroll into view
		* @param {Boolean} [scrollFullPage] - If `true` scrolls until the edge of `control` is
		*	aligned with the edge of the visible scroll area. If `undefined`, the value in
		*	[`scrollFullPage`]{@link moon.Scroller#scrollFullPage} is used.
		* @param {Boolean} [animate=true] - If `true`, animates the scroll
		* @param {Boolean} [setLastFocusedChild=false] - If `true`, scroller will set up `control`
		*	to be the spotted child when scroller is spotted.
		* @public
		*/
		scrollToControl: function (control, scrollFullPage, animate, setLastFocusedChild) {
			if (setLastFocusedChild) {
				this.$.strategy.setLastFocusedChild(control);
			}
			this.$.strategy.animateToControl(control, scrollFullPage, animate);
		},

		/**
		* Accepts third optional paramater to indicate whether or not it should
		* animate the scroll. Defaults to animation unless it is set to `false`.
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
			{from: '.paginationScrollMultiplier',	to:'.$.strategy.paginationScrollMultiplier'}
		],

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.spotlightPagingControlsChanged();
			this.scrollWheelMovesFocusChanged();
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
				if (!enyo.Spotlight.getPointerMode()) {
					var curr = enyo.Spotlight.getCurrent();
					if (curr && curr.isDescendantOf(this)) {
						var dir = inEvent.type == 'onSpotlightScrollUp' ? 'onSpotlightUp' : 'onSpotlightDown';
						this._spotlightModal = this.spotlightModal;
						this.spotlightModal = true;	// Trap focus inside scroller while wheeling
						enyo.Spotlight.Util.dispatchEvent(dir, {type: dir}, curr);
						this.spotlightModal = this._spotlightModal;
						return true;
					}
				}
			}
		},

		/**
		* When scroller is entered or one of its children is focused
		* in 5-way mode, make sure that we're showing the scroll columns
		*
		* @private
		*/
		spotlightHello: function (inSender, inEvent) {
			if (this.$.strategy.showHideScrollColumns) {
				this.$.strategy.showHideScrollColumns(true);
			}
		},

		/**
		* When 5-way focus leaves scroller, hide the scroll columns
		*
		* @private
		*/
		spotlightGoodbye: function (inSender, inEvent) {
			if (inEvent.originator.owner === this.$.strategy && this.$.strategy.showHideScrollColumns) {
				this.$.strategy.showHideScrollColumns(false);
			}
		},

		/**
		* @private
		*/
		previewDomEvent: function (inEvent) {
			if (this.scrollWheelMovesFocus) {
				if (inEvent.type == 'mousewheel') {
					this.setUseMouseWheel(enyo.Spotlight.getPointerMode());
				}
			}
		}
	});

	/**
	* On touch platforms, revert to using Enyo scroller, which picks an appropriate
	* scroll strategy for the given platform
	*
	* @private
	*/
	if (enyo.platform.touch) {
		moon.Scroller = enyo.Scroller;
	}

})(enyo, this);
