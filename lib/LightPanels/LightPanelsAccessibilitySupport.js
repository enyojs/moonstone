var
	kind = require('enyo/kind');

var
	VoiceReadout = require('enyo-webos/VoiceReadout');

/**
* @name LightPanelsAccessibilitySupport
* @mixin
*/
module.exports = {

	/**
	* @private
	*/
	setupTransitions: kind.inherit(function (sup) {
		return function () {
			var panels = this.getPanels(),
				nextpanel = panels[this.index];
			if (nextpanel) {
				// Before panel is moved, each panel's preTransition function is called. In this function, 
				// spotlightPlaceholder, which is dummy child component of panel is spotlight focused. However, 
				// There is a bug that TV reads parent aria-label when spotlightPlaceholder is focused, so
				// add aria-hidden before spotlightPlaceholder is focused.
				nextpanel.setAttribute('aria-hidden', true);
				VoiceReadout.readAlert(nextpanel.getAttribute('aria-label') || nextpanel.get('title'));
			}
			sup.apply(this, arguments);
			// After reads panel title or label, revert added aria-hidden.
			if (nextpanel && !nextpanel.accessibilityDisabled) {
				nextpanel.setAttribute('aria-hidden', null);
			}
		};
	})
};