(function(enyo, scope) {
	/**
	* @namespace moon
	*/
	var moon = scope.moon = scope.moon || {};

	/**
	* Global *design-time* configuration options for Moonstone
	*
	* @param {Boolean} Set accelerate `false` to prefer position properties over CSS transforms.
	* @type {Object}
	*/
	moon.config = enyo.mixin({
		accelerate: true
	}, moon.config);

	// Override the default holdpulse config to account for greater delays between keydown and keyup
	// events in Moonstone with certain input devices.
	if (enyo && enyo.gesture && enyo.gesture.drag) {
		enyo.gesture.drag.configureHoldPulse({
			frequency: 200,
			events: [{name: 'hold', time: 400}],
			resume: false,
			moveTolerance: 1500,
			endHold: 'onMove'
		});
	}

})(enyo, this);