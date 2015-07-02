var
	kind = require('enyo/kind');
var
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name IntegerPickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'readChangedValue', path: ['value']}
	],

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			// Set accessibilityLabel instead of 'aria-label' directly
			// to be able to use accessibilityHint.
			this.set('accessibilityLabel', enabled ? this.value : null);
		};
	}),

	/**
	* @private
	*/
	readChangedValue: function () {
		var enabled = !this.accessibilityDisabled;
		if (enabled) {
			VoiceReadout.readAlert(String(this.value));
		}
		this.set('accessibilityLabel', enabled ? this.value : null);
	}
};