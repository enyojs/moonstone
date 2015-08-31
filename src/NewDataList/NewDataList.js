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
		var e, l, idx, d2x, row, limitRow, verMovOnHorScrol, horMovOnVerScrol;

		e = event.type;
		verMovOnHorScrol = (this.direction === 'horizintal' &&  (e === 'onSpotlightUp' || e === 'onSpotlightDown'));
		horMovOnVerScrol = (this.direction === 'vertical' &&  (e === 'onSpotlightRight' || e === 'onSpotlightLeft'));

		// Only need to guard if we are accelerating or
		// scroll direction and spotlight moving direction matches
		if (!Spotlight.Accelerator.isAccelerating() || verMovOnHorScrol || horMovOnVerScrol) return false;

		// Figure out the index of the last de-virtualized element
		// in the direction we're currently scrolling; anything
		// further out doesn't yet have a DOM node
		l = (e === 'onSpotlightUp' || e === 'onSpotlightLeft') ? 
			this.first :
			this._last;

		// Get the index of the currently focused element
		idx = event.index;

		// In case we're in a grid layout, we need to translate
		// these indices into the corresponding row / column
		d2x = this.dim2extent;
		row = Math.floor(idx / d2x);
		limitRow = Math.floor(l / d2x);

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
	}
});
