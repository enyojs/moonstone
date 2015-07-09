/**
* Provides a mixin to add accessibility support to
* {@link module:moonstone/SelectableItem~SelectableItem}
*
* @module moonstone/SelectableItem/SelectableItemAccessibilitySupport
* @private
*/

var
	kind = require('enyo/kind');

/**
* @name SelectableItemAccessibilitySupport
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
			this.setAttribute('role', enabled ? 'radio' : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
			this.setAttribute('aria-checked', enabled ? String(this.selected) : null);
			this.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.getId() : null);
		};
	})
};
