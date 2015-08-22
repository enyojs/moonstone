var
	kind = require('enyo/kind');

var
	$L = require('../i18n');

/**
* @name InputDecoratorAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	spotlightFocusedHandler: kind.inherit(function (sup) {
		return function (oSender, oEvent) {
			var text = '',
				oInput = this.getInputControl(),
				enabled = !oInput.accessibilityDisabled;

			this.setAttribute('aria-live', this.accessibilityDisabled ? null : 'polite');
			if (enabled && oInput) {
				text = (oInput.getValue() || oInput.getPlaceholder()) + ' ' + $L('edit box');
			}
			this.set('accessibilityLabel', text);

			sup.apply(this, arguments);

			// bubble 'onInputSpotFocused' event instead of onSpotlightFocused to handle if it is needed.
			this.bubble('onInputSpotFocused');

			// return true to stop the event bubble so the accessibility code in spotlight doesn't
			// force a focus() thereby activating the internal <input>
			return true;
		};
	}),

	/**
	* @private
	*/
	spotlightBlurHandler: kind.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.setAttribute('aria-live', null);
			this.set('accessibilityLabel', null);
		};
	})
};