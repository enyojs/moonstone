var
	kind = require('enyo/kind');

/**
* @name AccordionAccessibilityMixin
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
			this.$.headerWrapper.set('accessibilityLabel', this.accessibilityLabel);
			this.$.headerWrapper.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.$.header.getId() : null);
		};
	})
};