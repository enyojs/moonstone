var
	kind = require('enyo/kind');

var
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name LightPanelsAccessibilityMixin
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	updateSpottability: kind.inherit(function (sup) {
		return function (from, to) {		
			var panels = this.getPanels(),
				panelNext = panels[to];

			if (panelNext && panelNext.$.header) {
				VoiceReadout.readAlert(panelNext.$.header.getTitle());
			}
			sup.apply(this, arguments);
		};
	})
	
};