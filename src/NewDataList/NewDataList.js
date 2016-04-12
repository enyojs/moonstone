/**
* Contains the declaration for the {@link module:moonstone/NewDataList~NewDataList} kind.
* @wip
* @module moonstone/NewDataList
*/

require('moonstone');

var
	kind = require('enyo/kind'),
	NewDataList = require('enyo/NewDataList');

var
	Spotlight = require('spotlight'),
	VDRSpotlightSupport = require('spotlight/VDRSpotlightSupport');

var
	Scrollable = require('../Scrollable'),
	ScrollControls = require('../ScrollControls');

/**
* A Moonstone NewDataList implementation. Currently under development.
*
* @class NewDataList
* @extends module:enyo/NewDataList~NewDataList
* @ui
* @wip
* @public
*/
module.exports = kind({
	name: 'moon.NewDataList',
	kind: NewDataList,
	scrollControls: [{kind: ScrollControls}],
	touch: false,
	mixins: [Scrollable, VDRSpotlightSupport],
	handlers: {
		onSpotlightUp: 'guard5way',
		onSpotlightRight: 'guard5way',
		onSpotlightDown: 'guard5way',
		onSpotlightLeft: 'guard5way'
	},
	/**
	* Prevent accelerating 5-way focus events from trying
	* to spot elements that don't yet have DOM nodes.
	*
	* @private
	*/
	guard5way: function (sender, event) {
		var e, limit, idx, d2x, row, limitRow, movingInScrollDimension;

		e = event.type;
		movingInScrollDimension =
			(this.direction === 'vertical' && (e === 'onSpotlightUp' || e === 'onSpotlightDown')) ||
			(this.direction === 'horizontal' && (e === 'onSpotlightRight' || e === 'onSpotlightLeft'));

		// If we're not accelerating, or not moving along
		// our scrollable dimension, then we don't need to guard
		if (!Spotlight.Accelerator.isAccelerating() || !movingInScrollDimension) return false;

		// Figure out the index of the last de-virtualized element
		// in the direction we're currently scrolling; anything
		// further out doesn't yet have a DOM node
		limit = (e === 'onSpotlightUp' || e === (this.rtl ? 'onSpotlightRight' : 'onSpotlightLeft')) ?
			this.first :
			this._last;

		// Get the index of the currently focused element
		idx = event.index;

		// In case we're in a grid layout, we need to translate
		// these indices into the corresponding row / column
		d2x = this.dim2extent;
		row = Math.floor(idx / d2x);
		limitRow = Math.floor(limit / d2x);

		// If we're in the last de-virtualized row, the element we
		// would focus from here doesn't yet have a DOM node, so
		// we return true to prevent an attempt to focus. We'll wait
		// for the next accelerated 5-way event and try again...
		return (row === limitRow);
	},
	/**
	* Scrolls to a list item (specified by index).
	*
	* In addition to the standard scrolling options, you can specify
	* `focus: true` if you want the item you're scrolling to to be
	* Spotlight focused. Currently, setting `focus: true` forces the
	* scroll behavior to be `instant`, meaning that the scroller will
	* jump to the item (with no animation).
	*
	* @see module:enyo/NewDataList~NewDataList.scrollToItem
	* @param {number} index - The (zero-based) index of the item to scroll to
	* @param {Object} opts - Scrolling options (see module:enyo/Scrollable~Scrollable.scrollTo)
	* @public
	*/
	scrollToItem: function(index, opts) {
		var item;

		if (opts && opts.focus) {
			opts.behavior = 'instant';
		}

		NewDataList.prototype.scrollToItem.apply(this, arguments);

		if (opts && opts.focus && !Spotlight.getPointerMode()) {
			item = this.childForIndex(index);
			if (item) Spotlight.spot(item);
		}
	},
	/**
	* Called by moonstone/Scrollable.filterFocus()
	* @private
	*/
	eventIsFromScrollingChild: function (event) {
		return (typeof event.index === 'number');
	},
	/**
	* Called by moonstone/Scrollable.filterFocus()
	* @private
	*/
	spotFirstVisibleChild: function() {
		var fv = this.getFullyVisibleItems()[0] || this.getVisibleItems()[0];
		if (fv) {
			Spotlight.spot(fv);
			return true;
		}
	},
	/**
	* Called by moonstone/Scrollable.filterFocus()
	* @private
	*/
	eventIsFromVisibleChild: function (event) {
		var control = event.originator,
			controls = this.orderedChildren.slice(this.firstFullyVisibleI, this.lastFullyVisibleI + 1),
			i;

		for (i = 0; i < controls.length; i++) {
			if (control.isDescendantOf(controls[i])) {
				return true;
			}
		}

		return false;
	}
});
