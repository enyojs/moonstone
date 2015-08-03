var 
	kind = require('enyo/kind');

/**
* @name  MarqueeSupportAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	_marquee_accessibility_handlers: {
		onRequestMarqueeStart  : 'marqueeStartHandler',
		onSpotlightBlur : 'spotlightBlurHandler'
	},

	/**
	* @method
	* @private
	*/
	dispatchEvent: kind.inherit(function (sup) {
		return function (sEventName, oEvent, oSender) {
			if (oEvent && !oEvent.delegate) {
				var handler = this._marquee_accessibility_handlers[sEventName];
				if (handler && this[handler](oSender, oEvent)) {
					return true;
				}
			}
			return sup.apply(this, arguments);
		};
	}),

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
	spotlightBlurHandler: function (oSender, oEvent) {
		var enabled = !this.accessibilityDisabled;
		if (this.marqueeOnSpotlight && enabled) {
			this.setAttribute('aria-hidden', null);
		}
	}
};