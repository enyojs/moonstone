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
			var enabled = !this.accessibilityDisabled,
				ids = this.$.header.getId() + ' ' + this.$.currentValue.getId();
			sup.apply(this, arguments);
			this.$.headerWrapper.setAttribute('aria-labelledby', enabled ? ids : null);
			this.$.headerWrapper.set('accessibilityDisabled', this.accessibilityDisabled);
			this.$.client.set('accessibilityDisabled', this.accessibilityDisabled);
			this.$.helpText.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};