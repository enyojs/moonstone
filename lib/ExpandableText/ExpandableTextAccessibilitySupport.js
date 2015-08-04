var
	kind = require('enyo/kind');

/**
* @name ExpandableTextAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.$.button.setAttribute('aria-labelledby', enabled ? this.$.client.getId() : null);
		};
	})
};