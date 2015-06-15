var
	kind = require('enyo/kind');

/**
* @name CheckboxAccessibilityMixin
* @mixin
*/
module.exports = {
	
	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.checkboxIcon.set('accessibilityDisabled', true);
		};
	}),
	
	/**
	* @private
	*/
	accessibilityDisabledChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.checkboxIcon.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};