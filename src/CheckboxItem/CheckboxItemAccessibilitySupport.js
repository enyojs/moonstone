/**
* Provides a mixin to add accessibility support to
* {@link module:moonstone/CheckboxItem~CheckboxItem}
*
* @module moonstone/CheckboxItem/CheckboxItemAccessibilitySupport
* @private
*/

var
	kind = require('enyo/kind');

/**
* @name CheckboxItemAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['checked']}
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
			this.setAttribute('aria-checked', enabled ? String(this.checked) : null);
			this.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.$.client.getId() : null);
		};
	})
};
