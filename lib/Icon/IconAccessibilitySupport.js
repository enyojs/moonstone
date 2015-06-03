var
	kind = require('enyo/kind');

/**
* @name IconAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	iconChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			if (this.get('small')) {
				this.$.tapArea.setAttribute('aria-label', null);
			} else {
				this.setAttribute('aria-label', null);
			} 
		};
	})
};