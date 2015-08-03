var
	kind = require('enyo/kind');

/**
* @name ProgressBarAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	bindings: [
		{from: 'disabled', to: 'accessibilityDisabled'}
	],

	/**
	* @private
	*/
	rendered: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);

			this.setAttribute('role', enabled ? 'progressbar' : null);
			this.setAttribute('aria-valuenow', enabled ? this.progress : null);
			this.setAttribute('aria-valuetext', enabled && this.popup ? this.$.popupLabel.getContent() : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
		};
	}),

	/**
	* @private
	*/
	progressAnimatorComplete: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);

			this.setAttribute('role', enabled ? 'progressbar' : null);
			this.setAttribute('aria-valuenow', enabled ? this.progress : null);
			this.setAttribute('aria-valuetext', enabled && this.popup ? this.$.popupLabel.getContent() : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
		};
	})
};
