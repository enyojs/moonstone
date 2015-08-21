var
	kind = require('enyo/kind');

var
	$L = require('../i18n'),
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name LightPanelsAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	applyTransitions: kind.inherit(function (sup) {
		return function (nextpanel) {
			sup.apply(this, arguments);
			// applyTransitions(nextpanel) is called in setupTransitions() when panel is moved,
			// so we applied readAlert for reading 'new page' after panel transition is completed.
			if (nextpanel) {
				VoiceReadout.readAlert($L('new page'));
			}
		};
	})
};