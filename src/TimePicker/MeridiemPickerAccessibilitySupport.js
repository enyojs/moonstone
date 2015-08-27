var
	kind = require('enyo/kind');

/**
* @name MeridiemPickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: ['value']}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.setAttribute('aria-valuetext', this.meridiems[this.value]);
		};
	})
};