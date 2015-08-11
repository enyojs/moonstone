var
	kind = require('enyo/kind');

/**
* @name DatePickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.$.day.set('accessibilityLabel', this.dayText);
			this.$.month.set('accessibilityLabel', this.monthText);
			this.$.year.set('accessibilityLabel', this.yearText);
		};
	})
};