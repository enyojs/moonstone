/**
* Provides a mixin to add accessibility support to
* {@link module:moonstone/Item~Item}
*
* @module moonstone/Item/ItemAccessibilitySupport
* @private
*/

var
	kind = require('enyo/kind');

/**
* @name  ItemAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.getId() : null);
		};
	})
};