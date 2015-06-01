var
	kind = require('enyo/kind');

/**
* @name CheckboxItemAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.setAttribute('role', 'checkbox');
		};
	}),

	/**
	* @private
	*/
	checkedChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
		};
	})
};