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
	guard5way: function (sender, event) {
		var e, l, idx, d2x, row, limitRow;

		if (!Spotlight.Accelerator.isAccelerating()) return false;

		e = event.type;
		l = (e === 'onSpotlightUp' || e === 'onSpotlightLeft') ? 
			this.first :
			this._last;

		// Important to use sender instead of event.originator here
		// since, if we have nested repeaters, the index of the
		// originator is probably not the one we want.
		idx = sender.index;
		d2x = this.dim2extent;

		row = Math.floor(idx / d2x);
		limitRow = Math.floor(l / d2x);

		return (row === limitRow);
	}
});
