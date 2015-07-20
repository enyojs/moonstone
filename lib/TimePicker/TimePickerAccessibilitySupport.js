var
	kind = require('enyo/kind');

/**
* @name TimePickerAccessibilityMixin
* @mixin
*/
module.exports = {

	/*
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function (was, is, prop) {
			sup.apply(this, arguments);
			this.$.hour.set('accessibilityLabel', this.hourText);
			this.$.minute.set('accessibilityLabel', this.minuteText);
			if (this.$.meridiem) {
				this.$.meridiem.set('accessibilityLabel', this.meridiemText);
			}
		};
	})
};