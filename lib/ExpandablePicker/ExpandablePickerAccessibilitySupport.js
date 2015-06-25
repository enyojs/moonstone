var
	kind = require('enyo/kind');

/**
* @name ExpandablePickerAccessibilityMixin
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
			this.$.headerWrapper.setAttribute('aria-labelledby', enabled ? this.$.headerWrapper.getId() : null);
			this.$.headerWrapper.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};