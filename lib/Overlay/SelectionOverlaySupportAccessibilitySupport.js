var
	kind = require('enyo/kind');

/**
* @name SelectionOverlaySupportAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['selected']}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('role', enabled ? 'checkbox' : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
			this.setAttribute('aria-checked', enabled ? String(this.selected) : null);
		};
	})
};
