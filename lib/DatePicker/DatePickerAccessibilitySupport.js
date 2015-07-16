var
	kind = require('enyo/kind'),
	$L = require('../i18n');

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
			this.$.day.set('accessibilityLabel', $L('day'));
			this.$.month.set('accessibilityLabel', $L('month'));
			this.$.year.set('accessibilityLabel', $L('year'));
		};
	})
};