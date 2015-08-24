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
				if (oInput.type === 'password') {
					text = oInput.get('value') ? oInput.get('value').length + ' ' + $L('values') + ' ' + $L('edit box') :
							oInput.get('placeholder') + ' ' + $L('edit box');
				} else {
					text = (oInput.get('value') || oInput.get('placeholder')) + ' ' + $L('edit box');
				}
			}
			this.setAriaAttribute('aria-label', text);

			sup.apply(this, arguments);
		};
	})
};