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
			var e, v, idx, d2x, dec, inc, adjLast;

			if (!enyo.Spotlight.Accelerator.isAccelerating()) return false;

			e = event.type;
			v = this.direction === 'vertical';
			// Important to use sender instead of event.originator here
			// since, if we have nested repeaters, the index of the
			// originator is probably not the one we want.
			idx = sender.index;
			d2x = this.dim2extent;

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
					return (idx - this.first) < d2x;
				case inc:
					adjLast = d2x > 1 ? d2x * Math.ceil(this._last / d2x) : this._last;
					return (adjLast - idx) < d2x;
				default:
					return false;
			}
		}
	});

})(enyo, moon, this);