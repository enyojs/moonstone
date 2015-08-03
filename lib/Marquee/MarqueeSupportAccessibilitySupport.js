/**
* @name  MarqueeSupportAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	handlers: {
		onRequestMarqueeStart  : 'marqueeStartHandler',
		onSpotlightBlur : 'spotlightBlurdHandler'
	},
	
	/**
	* @private
	*/
	marqueeStartHandler: function (oSender, oEvent) {
		var enabled = !this.accessibilityDisabled;
		if (this.marqueeOnSpotlight && enabled) {
			this.setAttribute('aria-hidden', 'true');
		}
	},

	/**
	* @private
	*/
	spotlightBlurdHandler: function (oSender, oEvent) {
		var enabled = !this.accessibilityDisabled;
		if (this.marqueeOnSpotlight && enabled) {
			this.setAttribute('aria-hidden', null);
		}
	}
};