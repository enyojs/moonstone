var
	kind = require('enyo/kind');

var
	Spotlight = require('spotlight');

/**
* @name TooltipDecoratorAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	handlers: {
		onInputSpotFocused: 'showTooltip'
	},

	/**
	* @private
	*/
	showTooltip: function (inSender, inEvent) {
		if (this.autoShow && !Spotlight.isFrozen()) {
				this.waterfallDown('onRequestShowTooltip', {originator: inSender}, this);
		}
	}
};