/**
* Provides a mixin to add accessibility support to
* {@link module:moonstone/Item~Item}
*
* @module moonstone/Item/ItemAccessibilitySupport
* @private
*/

var
	kind = require('enyo/kind');

/**
* @name  ItemAccessibilityMixin
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
	updateAccessibilityAttributes: kind.inherit(function (sup) {
		return function (was, is, prop) {
			var enabled = !this.accessibilityDisabled;
			sup.apply(this, arguments);
			this.setAttribute('aria-labelledby', !this.accessibilityLabel && enabled ? this.getId() : null);
		};
	}),

	/**
	* @private
	*/
	marqueeStartHandler: function (oSender, oEvent) {
		var enabled = !this.accessibilityDisabled;
		if (this._marquee_distance !== 0 && !this.$.marqueeText && enabled) {
			this.setAttribute('aria-hidden', 'true');
		}
	},

	/**
	* @private
	*/
	spotlightBlurdHandler: function (oSender, oEvent) {
		var enabled = !this.accessibilityDisabled;
		if (this._marquee_distance !== 0 && enabled && (this.getAttribute('aria-hidden') === 'true')) {
			this.setAttribute('aria-hidden', null);
		}
	}
};