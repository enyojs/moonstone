var
	kind = require('enyo/kind');

var
	$L = require('../i18n');

/**
* @name DrawersAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateActivator: kind.inherit(function (sup) {
		return function (open) {
			sup.apply(this, arguments);
			// drawer activator is updated when drawer is opened or closed, so Override this function for reading
			// activator label when activator is spotlight focused.
			if (this.isDrawerOpen()) {
				this.$.activator.set('accessibilityLabel', $L('close drawer'));
			} else {
				this.$.activator.set('accessibilityLabel', $L('open drawer'));
			}
		};
	})
};