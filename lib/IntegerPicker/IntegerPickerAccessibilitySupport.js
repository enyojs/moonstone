var
	kind = require('enyo/kind');

/**
* @name IntegerPickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	bindings: [
		{from: 'value', to: 'accessibilityLabel'}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('role', enabled ? 'spinbutton' : null);
		};
	})
};