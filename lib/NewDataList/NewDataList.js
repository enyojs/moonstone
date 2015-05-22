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
		onSpotlightLeft: 'guard5way',
		onSpotlightFocus: 'avoidScrollOnDefaultFocus'
	},
	guard5way: function (sender, event) {
		var e, l, idx, d2x, row, limitRow;

		if (!Spotlight.Accelerator.isAccelerating()) return false;

		e = event.type;
		l = (e === 'onSpotlightUp' || e === 'onSpotlightLeft') ? 
			this.first :
			this._last;

		idx = event.index;
		d2x = this.dim2extent;

		row = Math.floor(idx / d2x);
		limitRow = Math.floor(l / d2x);

		return (row === limitRow);
	},
	avoidScrollOnDefaultFocus: function (sender, event) {
		var fv;
		// When focusType is 'default', Spotlight is trying to focus
		// a Control in response to something other than a point or a
		// 5-way move. For example, this can happen during
		// initialization, when the pointer is hidden, or when the app
		// regains focus.
		//
		// In the case where a list element is being focused by default,
		// we short-circuit the action because the element is
		// potentially not in view, and focusing would cause it to
		// scroll it into view for no reason apparent to the user.
		// Instead, we just focus the first visible list element.
		if (event.focusType === 'default' && event.index) {
			fv = this.getFullyVisibleItems()[0] || this.getVisibleItems()[0];
			if (fv) {
				Spotlight.spot(fv);
				return true;
			}
		}
	}
});
