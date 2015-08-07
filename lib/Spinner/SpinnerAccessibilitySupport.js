var
	kind = require('enyo/kind');

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
			this.set('accessibilityAlert', enabled && this.get('showing') ? true : null);
			this.setAttribute('aria-live', enabled ? 'off' : null);
		};
	})
};
