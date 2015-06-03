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
			var label = this.accessibilityHint ? this.accessibilityHint : null;
			if (!this.accessibilityLabel) {
				if (this.get('small')) {
					this.$.tapArea.setAttribute('aria-label', label);
				} else {
					this.setAttribute('aria-label', label);
				}	
			}			
		};
	})
};