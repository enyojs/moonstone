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
			this.$.client.set('accessibilityDisabled', true);
			this.$.input.set('accessibilityDisabled', true);
		};
	}),

	/**
	* @private
	*/
	checkedChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			if (!this.accessibilityDisabled) {
				this.setAttribute('aria-checked', this.checked ? 'true' : 'false');		
			}
		};
	}),

	/**
	* @private
	*/
	accessibilityDisabledChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.client.set('accessibilityDisabled', this.accessibilityDisabled);
			this.$.input.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};