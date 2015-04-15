(function (enyo, moon, scope) {
	var MoonScrollable = moon.Scrollable;

	enyo.kind({
		name: 'moon.NewDataList',
		kind: 'enyo.NewDataList',
		scrollControls: [{kind: 'moon.ScrollControls'}],
		touch: false,
		mixins: [MoonScrollable],
		handlers: {
			onSpotlightUp: 'guard5way',
			onSpotlightRight: 'guard5way',
			onSpotlightDown: 'guard5way',
			onSpotlightLeft: 'guard5way'
		},
		guard5way: function (sender, event) {
			var e, v, idx, maxIdx, dec, inc;

			if (!enyo.Spotlight.Accelerator.isAccelerating()) return false;

			e = event.type;
			v = this.direction === 'vertical';
			idx = event.originator.index;
			maxIdx = this.get('data').length - 1;

			if (v) {
				dec = 'onSpotlightUp';
				inc = 'onSpotlightDown';
			}
			else {
				dec = 'onSpotlightLeft';
				inc = 'onSpotlightRight';
			}

			switch (e) {
				case dec:
					return (this.first > 0) && ((idx - this.first) <= this.dim2extent);
				case inc:
					return (this._last < maxIdx) && ((this._last - idx) <= this.dim2extent);
				default:
					return false;
			}
		}
	});

})(enyo, moon, this);