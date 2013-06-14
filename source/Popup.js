/**
	_moon.Popup_ is an <a href="#enyo.Popup">enyo.Popup</a> that appears at the
	bottom of the screen and takes up the full screen width.
*/
enyo.kind({
	name: "moon.Popup",
	kind: enyo.Popup,
	classes: "moon moon-dark-gray moon-popup",
	modal: true,
	floating: true,
	handlers: {
		onSpotlightSelect: "spotSelect"
	},

	//* @protected
	
	//* Sets _this.downEvent_ on _onSpotlightSelect_ event.
	spotSelect: function(inSender, inEvent) {
		this.downEvent = inEvent;
	},
	//* If _this.downEvent_ is set to a spotlight event, skips normal popup
	//* _tap()_ code.
	tap: function(inSender, inEvent) {
		if (this.downEvent.type !== "onSpotlightSelect") {
			return this.inherited(arguments);
		}
	}
});