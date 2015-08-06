var
	kind = require('enyo/kind');

/**
* @name ExpandableListItemAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	observers: [
		{method: 'updateAccessibilityAttributes', path: 'currentValueText'}
	],

	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled,
				content = enabled ? this.get('content') + ' ' + this.get('currentValueText') : null,
				prefix = this.accessibilityLabel || content || null,
				label = this.accessibilityHint && prefix && (prefix + ' ' + this.accessibilityHint) ||
						this.accessibilityHint ||
						this.accessibilityLabel ||
						null,
				header = this.$.header;

			sup.apply(this, arguments);
			header.setAttribute('aria-label', label);
			header.set('accessibilityDisabled', this.accessibilityDisabled);
		};
	})
};