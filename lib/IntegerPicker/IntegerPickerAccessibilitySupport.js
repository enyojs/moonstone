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
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['value']}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('role', enabled ? 'spinbutton' : null);
			this.setAttribute('aria-valuenow', enabled ? this.value : null);
		};
	})
};