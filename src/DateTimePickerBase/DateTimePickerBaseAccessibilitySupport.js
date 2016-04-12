/**
* Mixin that provides accessibility support for {@link module:moonstone/DateTimePickerBase~DateTimePickerBase}.
*
* @module moonstone/DateTimePickerBase/DateTimePickerBaseAccessibilitySupport
*/

var
	kind = require('enyo/kind');

/**
* @name DateTimePickerBaseAccessibilitySupport
* @mixin
*/
module.exports = {

	/*
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			this.$.client.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};
