var
	kind = require('enyo/kind');

var
	$L = require('../i18n');
/**
* @name SpinnerAccessibilityMixin
* @mixin
*/
module.exports = {

	observers: [
		{method: 'updateAccessibilityAttributes', path: 'showing'}
	],
	
	/**
	* @private
	*/
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function () {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			if (enabled && !this.accessibilityLabel && !this.accessibilityHint && !this.hasContent()) {
				this.set('accessibilityLabel', $L('Loading'));
			}
			this.set('accessibilityAlert', enabled && this.get('showing') ? true : null);
			this.setAttribute('aria-live', enabled ? 'off' : null);
		};
	})
};
