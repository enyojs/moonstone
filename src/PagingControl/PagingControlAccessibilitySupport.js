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
	* In 5-way mode, screen reader should read scroll direction string. Screen reader generally reads content or label when component is focused. 
	* Use readAlert() api because screen reader should read string whenever already focused component is pressed.
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
			// noop returns true, so this can not receive webkit focus, then screen reader can not read anything. 
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