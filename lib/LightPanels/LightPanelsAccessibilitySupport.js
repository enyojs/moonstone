var
	kind = require('enyo/kind');

var
	$L = require('../i18n');

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
				text = (oInput.get('value') || oInput.get('placeholder')) + ' ' + $L('edit box');
			}
			this.setAriaAttribute('aria-label', text);

			sup.apply(this, arguments);
		};
	})
};