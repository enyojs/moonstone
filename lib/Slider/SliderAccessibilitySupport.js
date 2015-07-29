var
	kind = require('enyo/kind');

/**
* @name SliderAccessibilityMixin
* @
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

			// Avoid reading aria-valuenow or aria-valuetext when it rendered.
			this.setAttribute('aria-hidden', 'true');

			this.setAttribute('role', enabled ? 'slider' : null);
			this.setAttribute('aria-valuenow', enabled ? this.value : null);
			this.setAttribute('aria-valuetext', enabled ? this.popupContent : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
		};
	}),

	/**
	* @private
	*/
	spotFocused: kind.inherit(function (sup) {
		return function (oSender, oEvent) {
			if (!this.accessibilityDisabled) {
				this.setAttribute('aria-hidden', 'false');
			}

			sup.apply(this, arguments);
		};
	}),

	/**
	* @private
	*/
	animatorComplete: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);

			this.setAttribute('role', enabled ? 'slider' : null);
			this.setAttribute('aria-valuenow', enabled ? this.value : null);
			this.setAttribute('aria-valuetext', enabled ? this.popupContent : null);
			this.setAttribute('tabindex', enabled ? 0 : null);
		};
	})
};