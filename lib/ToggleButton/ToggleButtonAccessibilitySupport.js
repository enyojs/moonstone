var
	kind = require('enyo/kind');

/**
* @name ToggleButtonAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.setAttribute('aria-pressed', this.value ? "true" : "false");
		};
	}),
	
	/**
	* @private
	*/
	valueChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.setAttribute('aria-pressed', this.value ? "true" : "false");
		};
	})
};