/**
	_moon.Popup_ is an [enyo.Popup](http://enyojs.com/api/#enyo.Popup)
	which is positioned at the bottom, full size width.

	Todo:
		- Spotlight support
*/
enyo.kind({
	name: "moon.Popup",
	kind: enyo.Popup,
	classes: "moon-dark-gray moon-popup",
	modal: true,
	floating: true,
	handlers: {
		onSpotlightSelect: "spotSelect"
	},

	//* @protected
	
	//* Set _this.downEvent_ on _onSpotlightSelect_ event
	spotSelect: function(inSender, inEvent) {
		this.downEvent = inEvent;
	},
	//* If _this.downEvent_ is set to a spotlight event, skip normal popup _tap()_ code
	tap: function(inSender, inEvent) {
		if (this.downEvent.type !== "onSpotlightSelect") {
			return this.inherited(arguments);
		}
	}
});