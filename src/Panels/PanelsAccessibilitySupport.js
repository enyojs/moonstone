var
	kind = require('enyo/kind');

var
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name PanelsAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	indexChanged: kind.inherit(function (sup) {
		return function () {
			var panels = this.getPanels(),
				nextpanel = panels[this.index];
			if (nextpanel) {
				VoiceReadout.readAlert(nextpanel.getAttribute('aria-label') || nextpanel.get('title'));
			}
			sup.apply(this, arguments);
		};
	})

};