require('moonstone');

/**
* Contains the declaration for the {@link moon.ScrollStrategy} kind.
* @module moonstone/ScrollStrategy
*/

var
	kind = require('enyo/kind'),
	dispatcher = require('enyo/dispatcher'),
	dom = require('enyo/dom'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	ScrollStrategy = require('enyo/ScrollStrategy'),
	TouchScrollStrategy = require('enyo/TouchScrollStrategy'),
	ScrollMath = require('enyo/ScrollMath'),
	Signals = require('enyo/Signals');

var
	Spotlight = require('spotlight');

var
	config = require('../options'),
	PagingControl = require('../PagingControl'),
	ScrollThumb = require('../ScrollThumb');

/**
* {@link moon.ScrollStrategy} inherits from {@link enyo.TouchScrollStrategy}.
* Its main purpose is to handle scroller paging for {@link moon.Scroller} and
* {@link moon.DataList}.
*
* @namespace moon
* @class moon.ScrollStrategy
* @extends enyo.TouchScrollStrategy
* @definedby module:moonstone/ScrollStrategy
* @public
*/
var MoonScrollStrategy = module.exports = kind(
	/** @lends moon.ScrollStrategy.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ScrollStrategy',

	/**
	* @private
	*/
	kind: TouchScrollStrategy,

	/**
	* @private
	* @lends moon.ScrollStrategy.prototype
	*/
	published: {

		/**
		* The ratio of mousewheel "delta" units to pixels scrolled. Increase this value to
		* increase the distance scrolled by the scroll wheel. Note that mice/trackpads do not
		* emit the same delta units per "notch" or flick of the scroll wheel/trackpad; that
		* can vary based on intensity and momentum.
		*
		* @type {Number}
		* @default 2
		* @public
		*/
		scrollWheelMultiplier: 2,

		/**
		* The ratio of the maximum distance scrolled by each scroll wheel event to the
		* height/width of the viewport. Setting a value larger than `1` is not advised since,
		* in that scenario, a single scroll event could potentially move more than one
		* viewport's worth of content (depending on the delta received), resulting in skipped
		* content.
		*
		* @type {Number}
		* @default 0.2
		* @public
		*/
		scrollWheelPageMultiplier: 0.2,

		/**
		* The ratio of the distance scrolled per tap of the paging button to the height/width
		* of the viewport. Setting a value larger than `1` is not advised since, in that
		* scenario, a single paging button tap would move more than one viewport's worth of
		* content, resulting in skipped content.
		*
		* @type {Number}
		* @default 0.8
		* @public
		*/
		paginationPageMultiplier: 0.8,

		/**
		* The ratio of continuous-scrolling "delta" units to pixels scrolled. Increase this
		* value to increase the distance scrolled when the pagination buttons are held.
		*
		* @type {Number}
		* @default 8
		* @public
		*/
		paginationScrollMultiplier: 8,

		/**
		* If 'true', paging controls are hidden when content fit in scroller
		* even when spotlightPagingControls is true.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		hideScrollColumnsWhenFit: false
	},

	/**
	* If `true`, measure the size of the scroll columns on initial render.
	* See {@link moon.ScrollStrategy#measureScrollColumns} for details.
	*
	* @private
	*/
	measureScrollColumns: false,

	/**
	* @private
	*/
	handlers: {
		onRequestScrollIntoView : 'requestScrollIntoView',
		onRequestSetupBounds	: 'requestSetupBounds',
		onenter                 : 'enter',
		onleave                 : 'leave',
		onSpotlightFocused      : 'manageSpotlightFocus',
		onSpotlightBlur         : 'manageSpotlightFocus'
	},

	/**
	* @private
	*/
	tools: [
		{kind: ScrollMath, onScrollStart: 'scrollMathStart', onScroll: 'scrollMathScroll', onScrollStop: 'scrollMathStop', onStabilize: 'scrollMathStabilize'}
	],

	/**
	* @private
	*/
	components: [
		{name: 'clientContainer', kind: Control, classes: 'moon-scroller-client-wrapper', components: [
			{name: 'viewport', kind: Control, classes:'moon-scroller-viewport', components: [
				{name: 'client', kind: Control, classes: 'enyo-touch-scroller enyo-touch-scroller-client matrix-scroll-client matrix3dsurface'}
			]}
		]},
		{name: 'vColumn', kind: Control, classes: 'moon-scroller-v-column', components: [
			{name: 'pageUpControl', kind: PagingControl, defaultSpotlightDisappear: 'pageDownControl', defaultSpotlightDown: 'pageDownControl', side: 'top', onPaginateScroll: 'paginateScroll', onPaginate: 'paginate', onSpotlightUp: 'spotPaging'},
			{name: 'vthumbContainer', kind: Control, classes: 'moon-scroller-thumb-container moon-scroller-vthumb-container', components: [
				{name: 'vthumb', kind: ScrollThumb, classes: 'moon-scroller-vthumb hidden', axis: 'v'}
			]},
			{name: 'pageDownControl', kind: PagingControl, defaultSpotlightDisappear: 'pageUpControl', defaultSpotlightUp: 'pageUpControl', side: 'bottom', onPaginateScroll: 'paginateScroll', onPaginate: 'paginate', onSpotlightDown: 'spotPaging'}
		]},
		{name: 'hColumn', kind: Control, classes: 'moon-scroller-h-column', components: [
			{name: 'pageLeftControl', kind: PagingControl, defaultSpotlightDisappear: 'pageRightControl', defaultSpotlightRight: 'pageRightControl', side: 'left', onPaginateScroll: 'paginateScroll', onPaginate: 'paginate', onSpotlightLeft: 'spotPaging'},
			{name: 'hthumbContainer', kind: Control, classes: 'moon-scroller-thumb-container moon-scroller-hthumb-container', components: [
				{name: 'hthumb', kind: ScrollThumb, classes: 'moon-scroller-hthumb hidden', axis: 'h'}
			]},
			{name: 'pageRightControl', kind: PagingControl, defaultSpotlightDisappear: 'pageLeftControl', defaultSpotlightLeft: 'pageLeftControl', side: 'right', onPaginateScroll: 'paginateScroll', onPaginate: 'paginate', onSpotlightRight: 'spotPaging'}
		]},
		{kind: Signals, onSpotlightModeChanged: 'spotlightModeChanged', isChrome: true}
	],

	/**
	* @private
	*/
	create: function() {
		TouchScrollStrategy.prototype.create.apply(this, arguments);
		this.transform = dom.canTransform();
		this.accel = dom.canAccelerate();
		this.container.addClass('enyo-touch-strategy-container');
		this.translation = this.accel ? 'matrix3d' : 'matrix';
		this.showHideScrollColumns(this.spotlightPagingControls);
	},

	/**
	* Calls super-super-inherited (i.e., skips {@link enyo.TouchScrollStrategy}'s) `rendered()`
	* function to avoid thumb flicker at render time. Then shows or hides page controls.
	*
	* @private
	*/
	rendered: function() {
		var measure = this.measureScrollColumns && !ScrollStrategy._scrollColumnsMeasured;

		if (measure) {
			// We temporarily add the v-scroll-enabled class so that
			// we can measure the width of the vertical scroll column
			// after rendering and store it as a static property -- see
			// _measureScrollColumns().
			//
			// The v-scroll-enabled class will automatically be removed
			// after we measure, when we call setupBounds() (which in
			// turn calls enableDisableScrollColumns()).
			this.$.clientContainer.addClass('v-scroll-enabled');
		}

		ScrollStrategy.prototype.rendered.apply(this, arguments);

		if (measure) {
			this._measureScrollColumns();
		}
		this.setupBounds();
		this.spotlightPagingControlsChanged();
	},

	/**
	* Moonstone's data grid list delegate uses scroll column metrics to calculate
	* available space for list controls. These metrics are derived via some LESS
	* calculations, so to avoid brittleness we choose to measure them from the DOM
	* rather than mirror the calculations in JavaScript.
	*
	* Upon request, we do the measurement here (the first time a scroller is rendered)
	* and cache the values in static properties, to avoid re-measuring each time we need
	* the metrics.
	*
	* @private
	*/
	_measureScrollColumns: function() {
		var cs;
		cs = dom.getComputedStyle(this.$.clientContainer.hasNode());
		MoonScrollStrategy.vScrollColumnSize =
			parseInt(cs['padding-left'], 10) +
			parseInt(cs['padding-right'], 10);
		MoonScrollStrategy.hScrollColumnSize = this.$.hColumn.hasNode().offsetHeight;
		MoonScrollStrategy._scrollColumnsMeasured = true;
	},

	/**
	* @private
	*/
	handleResize: function() {
		this.resizing = true;
		this.resetCachedValues();
		this.setupBounds();
		this.resizing = false;
	},

	/**
	* @private
	*/
	setupBounds: function() {
		this.calcBoundaries();
		this.syncScrollMath();
		this.enableDisableScrollColumns();
		this.setThumbSizeRatio();
		this.clampScrollPosition();
	},

	/**
	* Gets the left scroll position within the scroller.
	*
	* @returns {Number} The left scroll position.
	* @public
	*/
	getScrollLeft: function() {
		return this.scrollLeft;
	},

	/**
	* Gets the top scroll position within the scroller.
	*
	* @returns {Number} The top scroll position.
	* @public
	*/
	getScrollTop: function() {
		return this.scrollTop;
	},

	/**
	* Sets the left scroll position within the scroller.
	*
	* @param {Number} left - The desired scroll-left measurement (in pixels).
	* @public
	*/
	setScrollLeft: function(left) {
		var m = this.$.scrollMath,
			p = this.scrollLeft;
		m.setScrollX(-left);
		m.stabilize();
		if (p != -m.x) {
			// We won't get a native scroll event,
			// so need to make one ourselves
			m.doScroll();
		}
	},

	/**
	* Sets the top scroll position within the scroller.
	*
	* @param {Number} top - The desired scroll-top measurement (in pixels).
	* @public
	*/
	setScrollTop: function(top) {
		var m = this.$.scrollMath,
			p = this.scrollTop;
		m.setScrollY(-top);
		m.stabilize();
		if (p != -m.y) {
			// We won't get a native scroll event,
			// so need to make one ourselves
			m.doScroll();
		}
	},

	/**
	* Scrolls to specific x/y positions within the scroll area.
	*
	* @param {Number} x - The horizontal position.
	* @param {Number} y - The vertical position.
	* @param {Boolean} [animate=true] - Whether to animate to the new scroll position.
	* @public
	*/
	scrollTo: function(x, y, animate) {
		this.stop();
		if (this.resizing || animate === false) {
			var b = this.getScrollBounds();
			x = Math.max(Math.min(x, b.maxLeft), 0);
			y = Math.max(Math.min(y, b.maxTop),  0);
			this.effectScroll(x, y);
			this.syncScrollMath();
			this.bubble('onScroll');
		} else {
			this._scrollTo(x, y);
		}
	},

	/**
	* Overrides {@link enyo.TouchScrollStrategy#maxHeightChanged}.
	*
	* @private
	*/
	maxHeightChanged: function() {
		// content should cover scroller at a minimum if there's no max-height.
		this.$.client.applyStyle('min-height', this.maxHeight ? null : '100%');
		this.$.client.applyStyle('max-height', this.maxHeight);
		this.$.clientContainer.addRemoveClass('enyo-scrollee-fit', !this.maxHeight);
	},

	// Event handling

	/**
	* Disables dragging.
	*
	* @private
	*/
	shouldDrag: function(sender, event) { return true; },

	/**
	* On `hold` event, stops scrolling.
	*
	* @private
	*/
	hold: function(sender, event) {
		if (!this.isPageControl(event.originator)) {
			TouchScrollStrategy.prototype.hold.apply(this, arguments);
		}
	},

	/**
	* On `down` event, stops scrolling.
	*
	* @private
	*/
	down: function(sender, event) {
		if (!this.isPageControl(event.originator) && this.isScrolling() && !this.isOverscrolling()) {
			event.preventTap();
			this.stop();
		}
	},

	/**
	* On `mousewheel` event, scrolls a fixed amount.
	*
	* @private
	*/
	mousewheel: function(sender, event) {
		if (this.useMouseWheel) {
			var isScrolling = this.isScrolling();
			this.scrollBounds = this._getScrollBounds();
			this.setupBounds();

			var x = null,
				y = null,
				showVertical = this.showVertical(),
				showHorizontal = this.showHorizontal(),
				dir = null,
				val = null,
				max = null,
				delta = null
			;

			//* If we don't have to scroll, allow mousewheel event to bubble
			if (!showVertical && !showHorizontal) {
				this.scrollBounds = null;
				return false;
			}

			if (showVertical) {
				dir = event.wheelDeltaY >= 0 ? 1 : -1;
				val = Math.abs(event.wheelDeltaY * this.scrollWheelMultiplier);
				max = this.scrollBounds.clientHeight * this.scrollWheelPageMultiplier;
				delta = Math.min(val, max);
				y = (isScrolling ? this.lastScrollToY : this.scrollTop) + -dir * delta;
			}

			if (showHorizontal) {
				var intDirection = 1;
				// Reverse the direction for RTL
				if (this.$.pageLeftControl.rtl) {
					intDirection = -1;
				}
				if (event.wheelDeltaX) {
					dir = (event.wheelDeltaX >= 0 ? 1 : -1) * intDirection;
					val = Math.abs(event.wheelDeltaX * this.scrollWheelMultiplier);
					max = this.scrollBounds.clientWidth * this.scrollWheelPageMultiplier;
					delta = Math.min(val, max);
					x = (isScrolling ? this.lastScrollToX : this.scrollLeft) + -dir * delta;
				} else if (!showVertical) {
					// only use vertical wheel for horizontal scrolling when no vertical bars shown
					dir = (event.wheelDeltaY >= 0 ? 1 : -1) * intDirection;
					val = Math.abs(event.wheelDeltaY * this.scrollWheelMultiplier);
					max = this.scrollBounds.clientWidth * this.scrollWheelPageMultiplier;
					delta = Math.min(val, max);
					x = (isScrolling ? this.lastScrollToX : this.scrollLeft) + -dir * delta;
				}
			}

			this.scrollTo(x, y);
			event.preventDefault();
			this.scrollBounds = null;
			return true;
		}
	},

	/**
	* On `enter` event, sets `this.hovering` to `true` and shows pagination controls.
	*
	* @private
	*/
	enter: function(sender, event) {
		this.hovering = true;
		this.calcBoundaries();
		this.enableDisableScrollColumns();
		this.showHideScrollColumns(true);
		this.updateHoverOnPagingControls(true);
	},

	/**
	* On `leave` event, sets `this.hovering` to `false` and hides pagination controls.
	*
	* @private
	*/
	leave: function(sender, event) {
		this.hovering = false;
		this.showHideScrollColumns(false);
	},

	/**
	* Show / hide pagination controls in response to 5-way focus / blur events.
	*
	* @private
	*/
	manageSpotlightFocus: function(sender, event) {
		if (!Spotlight.getPointerMode()) {
			this.showHideScrollColumns(event.type == 'onSpotlightFocused');
		}
	},

	/**
	* Handles `paginate` events sent from [paging control]{@link moon.PagingControl} buttons.
	*
	* @private
	*/
	paginate: function(sender, event) {
		var sb = this.getScrollBounds(),
			scrollYDelta = sb.clientHeight * this.paginationPageMultiplier,
			scrollXDelta = sb.clientWidth * this.paginationPageMultiplier,
			side = event.originator.side,
			x = this.getScrollLeft(),
			y = this.getScrollTop()
		;

		switch (side) {
		case 'left':
			x -= scrollXDelta;
			break;
		case 'top':
			y -= scrollYDelta;
			break;
		case 'right':
			x += scrollXDelta;
			break;
		case 'bottom':
			y += scrollYDelta;
			break;
		}

		x = Math.max(0, Math.min(x, sb.maxLeft));
		y = Math.max(0, Math.min(y, sb.maxTop));

		this._scrollTo(x, y);

		return true;
	},

	/**
	* Handles `paginateScroll` events sent from [paging control]{@link moon.PagingControl}
	* buttons.
	*
	* @private
	*/
	paginateScroll: function(sender, event) {
		if (!event || !event.scrollDelta) {
			return;
		}

		var delta = event.scrollDelta * this.paginationScrollMultiplier,
			side = event.originator.side,
			val
		;

		switch (side) {
			case 'left':
				val = this.scrollLeft - delta;
				// When we hit the left, bounce and end scrolling
				if (val <= -this.$.scrollMath.leftBoundary) {
					this.setScrollLeft(-this.$.scrollMath.leftBoundary);
					this.$.pageLeftControl.hitBoundary();
				} else {
					this.setScrollLeft(val);
				}
				break;
			case 'top':
				val = this.scrollTop - delta;
				// When we hit the top, bounce and end scrolling
				if (val <= -this.$.scrollMath.topBoundary) {
					this.setScrollTop(-this.$.scrollMath.topBoundary);
					this.$.pageUpControl.hitBoundary();
				} else {
					this.setScrollTop(val);
				}
				break;
			case 'right':
				val = this.scrollLeft + delta;
				// When we hit the right, bounce and end scrolling
				if (val >= -this.$.scrollMath.rightBoundary) {
					this.setScrollLeft(-this.$.scrollMath.rightBoundary);
					this.$.pageRightControl.hitBoundary();
				} else {
					this.setScrollLeft(val);
				}

				break;
			case 'bottom':
				val = this.scrollTop + delta;
				// When we hit the bottom, bounce and end scrolling
				if (val >= -this.$.scrollMath.bottomBoundary) {
					this.setScrollTop(-this.$.scrollMath.bottomBoundary);
					this.$.pageDownControl.hitBoundary();
				} else {
					this.setScrollTop(val);
				}
				break;
		}

		return true;
	},

	/**
	* Scrolls to specific x/y positions within the scroll area.
	*
	* @private
	*/
	_scrollTo: function(x, y) {
		this.lastScrollToX = x;
		this.lastScrollToY = y;
		this.$.scrollMath.scrollTo(x, y);
	},

	/**
	* Returns `true` if passed-in [control]{@link enyo.Control} is one of four page controls.
	*
	* @private
	*/
	isPageControl: function(control) {
		return (
			control === this.$.pageUpControl ||
			control === this.$.pageDownControl ||
			control === this.$.pageLeftControl ||
			control === this.$.pageRightControl
		);
	},

	/**
	* @private
	*/
	calcBoundaries: function() {
		var s = this.$.scrollMath || this,
			b = this._getScrollBounds()
		;
		s.bottomBoundary = -1 * b.maxTop;
		s.rightBoundary = -1 * b.maxLeft;

		this.updatePagingControlState();
	},

	/**
	* @private
	*/
	effectScroll: function(x, y) {
		this.scrollLeft = (x !== null && !isNaN(x))? x: (this.scrollLeft || 0);
		this.scrollTop  = (y !== null && !isNaN(y))? y: (this.scrollTop  || 0);
		dom.transformValue(this.$.client, this.translation, this.generateMatrix());

		// since effectScroll will happen frequently but paging control status changes
		// infrequently, fire it immediately and then throttle the next update
		if (!this._updatePagingJob) {
			this.updatePagingControlState();
		} else {
			clearTimeout(this._updatePagingJob);
		}

		this._updatePagingJob = setTimeout(this.bindSafely(function () {
			this.updatePagingControlState();
			this._updatePagingJob = null;
		}), 32);
	},

	/**
	* @private
	*/
	generateMatrix: function() {
		var x = -1 * this.scrollLeft,
			y = -1 * this.scrollTop
		;

		/// Reverse the direction for RTL
		if (this.$.pageLeftControl.rtl) {
			x*= -1;
		}

		return (this.accel)
			?   '1,         0,     0,  0, '
			+   '0,         1,     0,  0, '
			+   '0,         0,     1,  0, '
			+    x + ', ' + y + ', 0,  1'

			:   '1, 0, 0, 1, ' + x + ', ' + y
		;
	},

	/**
	* @private
	*/
	effectScrollStop: function() { },

	/**
	* @private
	*/
	effectOverscroll: function() { },

	/**
	* @private
	*/
	spotlightPagingControlsChanged: function() {
		this.updateHoverOnPagingControls(!this.spotlightPagingControls);
		this.showHideScrollColumns(this.spotlightPagingControls);
		if (this.generated) {
			this.setupBounds();
		}
	},

	/**
	* @private
	*/
	updateHoverOnPagingControls: function(hover) {
		this.$.pageLeftControl.addRemoveClass('hover', hover);
		this.$.pageRightControl.addRemoveClass('hover', hover);
		this.$.pageUpControl.addRemoveClass('hover', hover);
		this.$.pageDownControl.addRemoveClass('hover', hover);
	},

	/**
	* @private
	*/
	updatePagingControlState: function () {
		// Update disabled state of paging controls based on bounds
		var m = this.$.scrollMath,
			b = this._getScrollBounds(),
			canVScroll = b.height > b.clientHeight,
			canHScroll = b.width > b.clientWidth,
			disablePageUp = (b.top <= 0) || !canVScroll,
			disablePageDown = (b.top >= -1 * m.bottomBoundary) || !canVScroll,
			disablePageLeft = (b.left <= 0) || !canHScroll,
			disablePageRight = (b.left >= -1 * m.rightBoundary) || !canHScroll;

		// Enable all of the paging controls (which are not already enabled) first, so that we
		// are not beholden to any ordering issues that can cause erratic Spotlight behavior.
		if (!disablePageUp) this.$.pageUpControl.set('disabled', false);
		if (!disablePageDown) this.$.pageDownControl.set('disabled', false);
		if (!disablePageLeft) this.$.pageLeftControl.set('disabled', false);
		if (!disablePageRight) this.$.pageRightControl.set('disabled', false);

		if (disablePageUp) this.$.pageUpControl.set('disabled', true);
		if (disablePageDown) this.$.pageDownControl.set('disabled', true);
		if (disablePageLeft) this.$.pageLeftControl.set('disabled', true);
		if (disablePageRight) this.$.pageRightControl.set('disabled', true);
	},

	/**
	* Decorate spotlight events from paging controls so user can 5-way out of container
	*
	* @private
	*/
	spotPaging: function (sender, event) {
		event.requestLeaveContainer = true;
	},

	/**
	* Because the thumb columns are a fixed size that impacts the scroll bounds, we capture
	* the difference for use in thumb rendering math.
	*
	* @private
	*/
	setThumbSizeRatio: function() {
		var scrollBounds = this.getScrollBounds();
		this.$.vthumb.setSizeRatio(this.getVerticalThumbBounds().height/scrollBounds.clientHeight);
		this.$.hthumb.setSizeRatio(this.getHorizontalThumbBounds().width/scrollBounds.clientWidth);
	},

	/**
	* Responds to child components' requests to be scrolled into view.
	*
	* @private
	*/
	requestScrollIntoView: function(sender, event) {
		var originator, showVertical, showHorizontal,
			bubble = false;
		if (!Spotlight.getPointerMode() || event.scrollInPointerMode === true) {
			originator = event.originator;
			showVertical = this.showVertical();
			showHorizontal = this.showHorizontal();
			this.scrollBounds = this._getScrollBounds();
			this.setupBounds();
			this.scrollBounds = null;
			if ((showVertical || showHorizontal) && (originator.getAbsoluteShowing())) {
				this.animateToControl(originator, event.scrollFullPage, event.scrollInPointerMode || false);
				if ((showVertical && this.$.scrollMath.bottomBoundary) || (showHorizontal && this.$.scrollMath.rightBoundary)) {
					this.alertThumbs();
				}
			} else {
				// Scrollers that don't need to scroll bubble their onRequestScrollIntoView,
				// to allow items in nested scrollers to be scrolled
				bubble = true;
			}
		}
		return !bubble;
	},

	/**
	* Responds to child components' requests to update scroll bounds without
	* scrolling into view.
	*
	* @private
	*/
	requestSetupBounds: function(sender, event) {
		if (this.generated) {
			this.scrollBounds = this._getScrollBounds();
			this.setupBounds();
			this.scrollBounds = null;
			if ((this.showVertical() && this.$.scrollMath.bottomBoundary) || (this.showHorizontal() && this.$.scrollMath.rightBoundary)) {
				this.alertThumbs();
			}
		}
		return true;
	},

	/**
	* @private
	*/
	spotlightModeChanged: function(sender, event) {
		var activatePageControls = this.shouldShowPageControls();
		this.showHideScrollColumns(activatePageControls);
		this.updateHoverOnPagingControls(activatePageControls);
	},

	/**
	* Enables or disables scroll columns.
	*
	* @private
	*/
	enableDisableScrollColumns: function() {
		this.enableDisableVerticalScrollControls(this.showVertical());
		this.enableDisableHorizontalScrollControls(this.showHorizontal());
	},

	/**
	* Enables or disables vertical scroll column.
	*
	* @private
	*/
	enableDisableVerticalScrollControls: function(enabled) {
		this.$.clientContainer.addRemoveClass('v-scroll-enabled', enabled);
		this.$.vColumn.addRemoveClass('v-scroll-enabled', enabled);
		this.$.hColumn.addRemoveClass('v-scroll-enabled', enabled);
		this.$.pageUpControl.spotlight = enabled && this.spotlightPagingControls;
		this.$.pageDownControl.spotlight = enabled && this.spotlightPagingControls;
	},

	/**
	* Enables or disables horizontal scroll column.
	*
	* @private
	*/
	enableDisableHorizontalScrollControls: function(enabled) {
		this.$.clientContainer.addRemoveClass('h-scroll-enabled', enabled);
		this.$.vColumn.addRemoveClass('h-scroll-enabled', enabled);
		this.$.hColumn.addRemoveClass('h-scroll-enabled', enabled);
		this.$.pageLeftControl.spotlight = enabled && this.spotlightPagingControls;
		this.$.pageRightControl.spotlight = enabled && this.spotlightPagingControls;
	},

	/**
	* Shows or hides scroll columns.
	*
	* @private
	*/
	showHideScrollColumns: function(show) {
		this.showHideVerticalScrollColumns(show);
		this.showHideHorizontalScrollColumns(show);
	},

	/**
	* Shows or hides vertical scroll columns.
	*
	* @private
	*/
	showHideVerticalScrollColumns: function(show) {
		this.$.vColumn.addRemoveClass('visible', show || this.spotlightPagingControls);
	},

	/**
	* Shows or hides horizontal scroll columns.
	*
	* @private
	*/
	showHideHorizontalScrollColumns: function(show) {
		this.$.hColumn.addRemoveClass('visible', show || this.spotlightPagingControls);
	},

	/**
	* Returns boolean indicating whether page controls should be shown at all for this scroller.
	*
	* @private
	*/
	shouldShowPageControls: function() {
		return (Spotlight.getPointerMode() && this.hovering && !this.spotlightPagingControls);
	},

	/**
	* Determines whether we should be showing the vertical scroll column.
	*
	* @private
	*/
	showVertical: function() {
		return (this.getVertical() == 'scroll' ||
				(this.getVertical() !== 'hidden' &&
				((-1 * this.$.scrollMath.bottomBoundary > 0) ||
				(this.spotlightPagingControls && !this.hideScrollColumnsWhenFit))));
	},

	/**
	* Determines whether we should be showing the horizontal scroll column.
	*
	* @private
	*/
	showHorizontal: function() {
		return (this.getHorizontal() == 'scroll' ||
				(this.getHorizontal() !== 'hidden' &&
				((-1 * this.$.scrollMath.rightBoundary > 0) ||
				(this.spotlightPagingControls && !this.hideScrollColumnsWhenFit))));
	},

	/**
	* Update bounds after change hideScrollColumnsWhenFit option changes.
	*
	* @private
	*/
	hideScrollColumnsWhenFitChanged: function(old) {
		this.requestSetupBounds();
	},

	/**
	* @private
	*/
	_getScrollBounds: function() {
		if (this.scrollBounds) {
			return this.scrollBounds;
		}
		var containerBounds = this.getContainerBounds(),
			s = this.getScrollSize(),
			b = {
				top: this.getScrollTop(),
				left: this.getScrollLeft(),
				clientHeight: containerBounds.height,
				clientWidth: containerBounds.width,
				height: s.height,
				width: s.width
			};

		b.maxLeft = Math.max(0, b.width - b.clientWidth);
		b.maxTop = Math.max(0, b.height - b.clientHeight);

		util.mixin(b, this.getOverScrollBounds());

		return b;
	},

	/**
	* @private
	*/
	getContainerBounds: function() {
		var containerBounds = this.$.clientContainer.getBounds();
		if(containerBounds) {
			var paddingExtents = dom.calcPaddingExtents(this.$.clientContainer.hasNode());
			containerBounds.width  -= (paddingExtents.left + paddingExtents.right);
			containerBounds.height -= (paddingExtents.top  + paddingExtents.bottom);
		}
		return containerBounds;
	},

	/**
	* @private
	*/
	getVerticalThumbBounds: function() {
		return this.vBounds ? this.vBounds : this.$.vthumbContainer.getBounds();
	},

	/**
	* @private
	*/
	getHorizontalThumbBounds: function() {
		return this.hBounds ? this.hBounds : this.$.hthumbContainer.getBounds();
	},

	/**
	* @private
	*/
	resetCachedValues: function() {
		this.vBounds = null;
		this.hBounds = null;
		this.scrollBounds = null;
	},
	/**
	* Scrolls until the passed-in [control]{@link enyo.Control} is in view.
	* If `scrollFullPage` is set, scrolls until the edge of `control` is aligned
	* with the edge of the visible scroll area.
	*
	* @param {Control} control - The [control]{@link enyo.Control} to scroll into view.
	* @param {Boolean} [scrollFullPage] - If `true`, scrolls until the edge of `control` is
	*	aligned with the edge of the visible scroll area. If `undefined`, the value in the
	*	container's `scrollFullPage` property is used.
	* @param {Boolean} [animate=true] - Set to `false` to prevent animation.
	* @private
	*/
	animateToControl: function(control, scrollFullPage, animate) {
		var controlBounds  = control.getAbsoluteBounds(),
			absoluteBounds = this.$.viewport.getAbsoluteBounds(),
			scrollBounds   = this._getScrollBounds(),
			offsetTop,
			offsetLeft,
			offsetHeight,
			offsetWidth,
			xDir,
			yDir,
			x,
			y
		;

		controlBounds.right = document.body.offsetWidth - controlBounds.right;
		absoluteBounds.right = document.body.offsetWidth - absoluteBounds.right;

		// Make absolute controlBounds relative to scroll position
		controlBounds.top += scrollBounds.top;
		if (this.rtl) {
			controlBounds.right += scrollBounds.left;
		} else {
			controlBounds.left += scrollBounds.left;
		}

		offsetTop      = controlBounds.top - absoluteBounds.top;
		offsetLeft     = (this.rtl ? controlBounds.right : controlBounds.left) - (this.rtl ? absoluteBounds.right : absoluteBounds.left);
		offsetHeight   = controlBounds.height;
		offsetWidth    = controlBounds.width;

		// Allow local scrollFullPage param to override scroller property
		scrollFullPage = (typeof scrollFullPage === 'undefined') ? this.container.getScrollFullPage() : scrollFullPage;

		// 0: currently visible, 1: right of viewport, -1: left of viewport
		xDir = (offsetLeft >= scrollBounds.left && offsetLeft + offsetWidth <= scrollBounds.left + scrollBounds.clientWidth)
			? 0
			: offsetLeft - scrollBounds.left > 0
				? 1
				: offsetLeft - scrollBounds.left < 0
					? -1
					: 0;

		// 0: currently visible, 1: below viewport, -1: above viewport
		yDir = (offsetTop >= scrollBounds.top && offsetTop + offsetHeight <= scrollBounds.top + scrollBounds.clientHeight)
			? 0
			: offsetTop - scrollBounds.top > 0
				? 1
				: offsetTop - scrollBounds.top < 0
					? -1
					: 0;

		scrollBounds.xDir = xDir;
		scrollBounds.yDir = yDir;

		switch (xDir) {
			case 0:
				x = this.getScrollLeft();
				break;
			case 1:
				// If control requested to be scrolled all the way to the viewport's left, or if the control
				// is larger than the viewport, scroll to the control's left edge. Otherwise, scroll just
				// far enough to get the control into view.
				if (scrollFullPage || offsetWidth > scrollBounds.clientWidth) {
					x = offsetLeft;
				} else {
					x = offsetLeft - scrollBounds.clientWidth + offsetWidth;
					// If nodeStyle exists, add the _marginRight_ to the scroll value.
					x += dom.getComputedBoxValue(control.hasNode(), 'margin', 'right');
				}
				break;
			case -1:
				// If control requested to be scrolled all the way to the viewport's right, or if the control
				// is larger than the viewport, scroll to the control's right edge. Otherwise, scroll just
				// far enough to get the control into view.
				if (scrollFullPage || offsetWidth > scrollBounds.clientWidth) {
					x = offsetLeft - scrollBounds.clientWidth + offsetWidth;
				} else {
					x = offsetLeft;
					// If nodeStyle exists, subtract the _marginLeft_ to the scroll value.
					x -= dom.getComputedBoxValue(control.hasNode(), 'margin', 'left');
				}
				break;
		}

		switch (yDir) {
			case 0:
				y = this.getScrollTop();
				break;
			case 1:
				// If control requested to be scrolled all the way to the viewport's top, or if the control
				// is larger than the viewport, scroll to the control's top edge. Otherwise, scroll just
				// far enough to get the control into view.
				if (scrollFullPage || offsetHeight > scrollBounds.clientHeight) {
					y = offsetTop;
					// If nodeStyle exists, add the _marginBottom_ to the scroll value.
					y -= dom.getComputedBoxValue(control.hasNode(), 'margin', 'top');
				} else {
					y = offsetTop - scrollBounds.clientHeight + offsetHeight;
					// If nodeStyle exists, add the _marginBottom_ to the scroll value.
					y += dom.getComputedBoxValue(control.hasNode(), 'margin', 'bottom');
				}
				break;
			case -1:
				// If control requested to be scrolled all the way to the viewport's bottom, or if the control
				// is larger than the viewport, scroll to the control's bottom edge. Otherwise, scroll just
				// far enough to get the control into view.
				if (scrollFullPage || offsetHeight > scrollBounds.clientHeight) {
					y = offsetTop - scrollBounds.clientHeight + offsetHeight;
				} else {
					y = offsetTop;
					// If nodeStyle exists, subtract the _marginTop_ to the scroll value.
					y -= dom.getComputedBoxValue(control.hasNode(), 'margin', 'bottom');
				}
				break;
		}

		// If x or y changed, scroll to new position
		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x, y, animate);
		}
	},

	/**
	* @private
	*/
	clampScrollPosition: function() {
		var x = this.clampX(),
			y = this.clampY();

		if (x !== this.getScrollLeft() || y !== this.getScrollTop()) {
			this.scrollTo(x, y);
		}
	},

	/**
	* @private
	*/
	clampX: function() {
		var m = this.$.scrollMath;
		return Math.min(Math.max(this.getScrollLeft(), -1*m.leftBoundary), -1*m.rightBoundary);
	},

	/**
	* @private
	*/
	clampY: function() {
		var m = this.$.scrollMath;
		return Math.min(Math.max(this.getScrollTop(), -1*m.topBoundary), -1*m.bottomBoundary);
	}
});

// FIXME: Webkit will change the scrollTop value of the scroller viewport to keep the current
// tab-focused control onscreen if we allow it to handle tabs itself, so we defeat native
// TAB focus movement here.
dispatcher.features.push(function(e) {
	if ((e.type == 'keydown') && (e.keyCode == 9)) {
		e.preventDefault();
	}
});

MoonScrollStrategy.Touch = kind({
	name: 'moon.TouchScrollStrategy',
	kind: TouchScrollStrategy,
	create: function () {
		TouchScrollStrategy.prototype.create.apply(this, arguments);
		if (!config.accelerate) {
			this.transform = false;
			this.accel = false;

			if(this.overscroll) {
				//so we can adjust top/left if browser can't handle translations
				this.$.client.applyStyle('position', 'relative');
			}
		}
	}
});
