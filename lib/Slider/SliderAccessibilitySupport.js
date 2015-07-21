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
			if (this.popup) {
				this.setAttribute('tabindex', enabled ? 0 : null);
				this.setAttribute('aria-label', enabled ? this.value : null);
			} else {
				this.setAttribute('role', enabled ? 'slider' : null);
				this.setAttribute('aria-valuenow', enabled ? this.value : null);
			}
			this.setAttribute('tabindex', enabled ? 0 : null);
		};
	})
};