/**
	_sunPopup_ is an <a href="#enyo.Popup">enyo.Popup</a> that appears at the
	bottom of the screen and takes up the full screen width.
*/
enyo.kind({
	name: "sun.Popup",
	kind: "moon.Popup",
	classes: "sun",
	tap: function(inSender, inEvent) {
		if (this.downEvent && this.downEvent.type !== "onSpotlightSelect") {
			return this.inherited(arguments);
		}
	}
});