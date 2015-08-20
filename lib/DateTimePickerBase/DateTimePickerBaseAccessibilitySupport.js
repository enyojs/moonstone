var
	kind = require('enyo/kind');

/**
* @name DateTimePickerBaseAccessibilityMixin
* @mixin
*/
module.exports = {

	/*
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.$.client.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};