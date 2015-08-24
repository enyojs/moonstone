var
	kind = require('enyo/kind');

/**
* @name ContextualPopupAccessibilityMixin
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
			this.setAttribute('aria-hidden', enabled ? !this.showing : true);
			this.setAttribute('aria-live', 'off');
		};
	})
};