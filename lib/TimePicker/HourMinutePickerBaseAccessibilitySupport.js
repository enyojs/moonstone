var
	kind = require('enyo/kind');

/**
* @name HourMinutePickerBaseAccessibilityMixin
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
			if (this.date && this.range) {
				var value = this.format(this.value % this.range);
				this.setAttribute('aria-valuenow', value);
			}
		};
	})
};