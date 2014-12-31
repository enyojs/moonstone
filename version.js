(function (enyo, scope) {
	/**
		A library of UI widgets designed for use alongside Enyo core in the
		development of smart TV applications.

		@namespace moon
	*/
	var moon = scope.moon = scope.moon || {};

	if (enyo && enyo.version) {
		enyo.version.moonstone = "2.5.4-pre.1.lite.2";
	}

	/**
	* Global *design-time* configuration options for Moonstone
	*
	* @param {Boolean} accelerate `true` to prefer CSS transforms over position properties
	* @type {Object}
	*/
	moon.config = enyo.mixin({
		accelerate: false
	}, moon.config);
})(enyo, this);
