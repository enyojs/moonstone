var
	kind = require('enyo/kind');

/**
* @name InputDecoratorAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	handlers: {
		onSpotlightFocused  : 'spotlightFocusedHandler'
	},

	/**
	* @private
	*/
	spotlightFocusedHandler: function (oSender, oEvent) {
		return true;
	}
};