var
	kind = require('enyo/kind');

var
	VoiceReadout = require('enyo-webos/VoiceReadout'),
	Spotlight = require('spotlight');	

var
	$L = require('../i18n');


/**
* @name PagingControlAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	depress: kind.inherit(function (sup) {
		return function (oSender, oEvent) {
			sup.apply(this, arguments);
			var side = oEvent.originator.side;
			switch(side) {
			case 'top':
				VoiceReadout.readAlert($L('up'));
				break;
			case 'bottom':
				VoiceReadout.readAlert($L('down'));
				break;
			case 'left':
				VoiceReadout.readAlert($L('left'));
				break;
			case 'right':
				VoiceReadout.readAlert($L('right'));
				break;
			}
		};
	}),

	/**
	* @private
	*/
	noop: kind.inherit(function (sup) {
		return function (oSender, oEvent) {
			if (oEvent.type == 'onSpotlightFocused' && !Spotlight.getPointerMode()) {
				this.focus();
			}
			sup.apply(this, arguments);
		};
	}),

	/**
	* @private
	*/
	ariaObservers: [
		{path: 'side', method: function () {
			var side = this.get('side');
			switch(side) {
			case 'top':
				this.set('accessibilityLabel', $L('scroll up'));
				break;
			case 'bottom':
				this.set('accessibilityLabel', $L('scroll down'));
				break;
			case 'left':
				this.set('accessibilityLabel', $L('scroll left'));
				break;
			case 'right':
				this.set('accessibilityLabel', $L('scroll right'));
				break;
			}
		}}
	]
};