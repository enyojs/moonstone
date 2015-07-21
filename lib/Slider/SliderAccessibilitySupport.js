var
	kind = require('enyo/kind');

/**
* @name SliderAccessibilityMixin
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
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('role', enabled ? 'slider' : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
			this.setAttribute('aria-valuenow', enabled ? this.value : null);
		};
	})
};