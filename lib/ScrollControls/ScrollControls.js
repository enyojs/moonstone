var
	dom = require('enyo/dom'),
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	NewScrollThumb = require('enyo/NewScrollThumb'),
	Signals = require('enyo/Signals');

var
	Spotlight = require('spotlight');

var
	NewPagingControl = require('../NewPagingControl');

/**
* TODO: {@link moon.ScrollControls} needs to be documented.
*
* @class moon.ScrollControls
* @public
*/
var ScrollControls = module.exports = kind(
	/** @lends moon.ScrollControls.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ScrollControls',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	tag: null,

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
	spotlightPagingControls: true,

	/**
	* If `true`, measure the size of the scroll columns on initial render.
	* See {@link moon.ScrollControls#measureScrollColumns} for details.
	*
	* @private
	*/
	measureScrollColumns: true,


	/**
	* @private
	*/
	components: [
		{name: 'vColumn', classes: 'moon-scroller-v-column', components: [
			{name: 'pageUpControl', kind: NewPagingControl, disabled: true, ontap: 'pageUp', defaultSpotlightDisappear: 'pageDownControl', defaultSpotlightDown: 'pageDownControl', side: 'top', onSpotlightUp: 'spotPaging'},
			{name: 'vthumbContainer', classes: 'moon-scroller-thumb-container moon-scroller-vthumb-container', components: [
				{name: 'vthumb', kind: NewScrollThumb, classes: 'moon-scroller-vthumb hidden', axis: 'v', minSize: 20}
			]},
			{name: 'pageDownControl', kind: NewPagingControl, disabled: true, ontap: 'pageDown', defaultSpotlightDisappear: 'pageUpControl', defaultSpotlightUp: 'pageUpControl', side: 'bottom', onSpotlightDown: 'spotPaging'}
		]},
		{name: 'hColumn', classes: 'moon-scroller-h-column', components: [
			{name: 'pageLeftControl', kind: NewPagingControl, disabled: true, ontap: 'pageLeft', defaultSpotlightDisappear: 'pageRightControl', defaultSpotlightRight: 'pageRightControl', side: 'left', onSpotlightLeft: 'spotPaging'},
			{name: 'hthumbContainer', classes: 'moon-scroller-thumb-container moon-scroller-hthumb-container', components: [
				{name: 'hthumb', kind: NewScrollThumb, classes: 'moon-scroller-hthumb hidden', axis: 'h', minSize: 20}
			]},
			{name: 'pageRightControl', kind: NewPagingControl, disabled: true, ontap: 'pageRight', defaultSpotlightDisappear: 'pageLeftControl', defaultSpotlightLeft: 'pageLeftControl', side: 'right', onSpotlightRight: 'spotPaging'}
		]},
		{kind: Signals, onSpotlightModeChanged: 'spotlightModeChanged', isChrome: true}
	],

	/**
	* @private
	*/
	create: function() {
		Control.prototype.create.apply(this, arguments);

		// TODO: Figure out how not to use parent here and elsewhere -- should be able to get there from scroller
		this.parent.addClass('moon-scroller-client-wrapper');

		this._updateScrollability = this.bindSafely(this.updateScrollability);
		this.scrollerChanged();

		this.$.vthumb.set('scroller', this.scroller);
		this.$.hthumb.set('scroller', this.scroller);
	},

	scrollerChanged: function(was) {
		if (was) {
			was.off('scrollabilityChanged', this._updateScrollability);
		}
		if (this.scroller) {
			this.scroller.on('scrollabilityChanged', this._updateScrollability);
		}
	},

	updateScrollability: function() {
		var s = this.scroller;

		this.enableDisableHorizontalScrollControls(s.hEnabled);
		this.enableDisableVerticalScrollControls(s.vEnabled);
		this.showHideHorizontalScrollColumns(s.canScrollX);
		this.showHideVerticalScrollColumns(s.canScrollY);
		this.$.pageUpControl.set('disabled', !s.canScrollUp);
		this.$.pageDownControl.set('disabled', !s.canScrollDown);
		this.$.pageLeftControl.set('disabled', !s.canScrollLeft);
		this.$.pageRightControl.set('disabled', !s.canScrollRight);
	},

	pageUp: function() {
		this.scroller.pageUp();
	},

	pageDown: function() {
		this.scroller.pageDown();
	},

	pageLeft: function() {
		this.scroller.pageLeft();
	},

	pageRight: function() {
		this.scroller.pageRight();
	},

	/**
	* Measures scroll columns as needed, then shows or hides page controls.
	*
	* @private
	*/
	rendered: function() {
		var measure = this.measureScrollColumns && !ScrollControls._scrollColumnsMeasured;

		if (measure) {
			// We temporarily add the v-scroll-enabled class so that
			// we can measure the width of the vertical scroll column
			// after rendering and store it as a static property -- see
			// _measureScrollColumns().
			//
			// The v-scroll-enabled class will automatically be removed
			// after we measure, when we call setupBounds() (which in
			// turn calls enableDisableScrollColumns()).
			this.parent.addClass('v-scroll-enabled');
		}

		Control.prototype.rendered.apply(this, arguments);
		
		if (measure) {
			this._measureScrollColumns();
		}

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
		cs = dom.getComputedStyle(this.parent.hasNode());
		ScrollControls.vScrollColumnSize =
			parseInt(cs['padding-left'], 10) +
			parseInt(cs['padding-right'], 10);
		ScrollControls.hScrollColumnSize = this.$.hColumn.hasNode().offsetHeight;
		ScrollControls._scrollColumnsMeasured = true;
	},

	/**
	* @private
	*/
	spotlightPagingControlsChanged: function() {
		this.updateHoverOnPagingControls(!this.spotlightPagingControls);
		this.showHideScrollColumns(this.spotlightPagingControls);
		// if (this.generated) {
		// 	this.setupBounds();
		// }
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
	* Decorate spotlight events from paging controls so user can 5-way out of container
	* 
	* @private
	*/
	spotPaging: function (sender, event) {
		event.requestLeaveContainer = true;
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
	* Enables or disables vertical scroll column.
	*
	* @private
	*/
	enableDisableVerticalScrollControls: function(enabled) {
		var hOffProp = this.rtl ? 'leftOffset' : 'rightOffset',
			hOffVal = enabled ? ScrollControls.vScrollColumnSize : 0;

		this.scroller.set(hOffProp, hOffVal);
		this.parent.addRemoveClass('v-scroll-enabled', enabled);
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
		var bOffVal = enabled ? ScrollControls.hScrollColumnSize : 0;

		this.scroller.set('bottomOffset', bOffVal);
		this.parent.addRemoveClass('h-scroll-enabled', enabled);
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
	}
});