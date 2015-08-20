var
	kind = require('enyo/kind');

var
	$L = require('../i18n'),
	RichText = require('../RichText');

/**
* @name InputDecoratorAccessibilitySupport
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

			if (oInput) {
				if (oInput instanceof RichText && oInput.hasNode()) {
					text = (oInput.hasNode().innerText || oInput.getPlaceholder()) + ' ' + $L('edit box');
				} else {
					text = (oInput.getValue() || oInput.getPlaceholder()) + ' ' + $L('edit box');
				}
			}
			this.setAriaAttribute('aria-label', text);

			sup.apply(this, arguments);
		};
	})
};