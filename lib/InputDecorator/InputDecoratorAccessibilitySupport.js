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
				oInput = this.getInputControl();

			this.setAriaAttribute('aria-live', 'polite');
			if (enabled && oInput) {
				text = (oInput.get('value') || oInput.get('placeholder')) + ' ' + $L('edit box');
			}
			this.setAriaAttribute('aria-label', text);

			sup.apply(this, arguments);

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
			this.setAriaAttribute('aria-live', null);
			this.setAriaAttribute('aria-label', null);
		};
	})
};