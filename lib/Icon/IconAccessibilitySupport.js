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
			// Font-based Icons set content value to font hash code. 
			// If accessibilityHint is set and content exists, screen reader reads accessibilityHint with content. 
			// To support this, accessibilityHint is implemented with aria-label including content and accessibilityHint content. 
			// However, this content value is font hash code in Font-base Icon. 
			// Therefore, we should set aria-label to only accessibilityHint content without this font hash code.
			var label = this.accessibilityHint ? this.accessibilityHint : null;
			if (!this.accessibilityLabel) {
				if (this.get('small')) {
					this.$.tapArea.setAttribute('aria-label', label);
				} else {
					this.setAttribute('aria-label', label);
				}	
			}			
		};
	}),

	/**
	* @private
	*/
	accessibilityDisabledChanged: kind.inherit(function (sup) {
		return function (props) {
			sup.apply(this, arguments);
			if (this.get('small')) {
				this.$.tapArea.set('accessibilityDisabled', this.accessibilityDisabled);
			}
		};
	})
};