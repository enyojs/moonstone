var
	kind = require('enyo/kind');

/**
* @name ExpandableListItemAccessibilityMixin
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
			this.$.headerContainer.set('accessibilityLabel', this.accessibilityLabel);
			this.$.headerContainer.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.$.header.getId() : null);
		};
	})
};