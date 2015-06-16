var
	kind = require('enyo/kind');

/**
* @name ButtonAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	initAccessibility: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			this.$.client.set('accessibilityDisabled', true);
		};
	})
};