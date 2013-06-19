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
	published: {
		/**
			Determines whether a scrim will appear when the dialog is modal.
			Note that modal scrims are transparent, so you won't see them.
		*/
		scrimWhenModal: true,
		//* Determines whether or not to display a scrim. Only displays scrims
		//* when floating.
		scrim: false,
		/**
			Optional class name to apply to the scrim. Be aware that the scrim
			is a singleton and you will be modifying the scrim instance used for
			other popups.
		*/
		scrimClassName: ""
	},
	//* @protected
	statics: { count: 0 },
	defaultZ: 120,
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
	},
	showingChanged: function() {
		if(this.showing) {
			moon.Popup.count++;
			this.applyZIndex();
		}
		else {
			if(moon.Popup.count > 0) {
				moon.Popup.count--;
			}
		}
		this.showHideScrim(this.showing);
		this.inherited(arguments);
	},
	showHideScrim: function(inShow) {
		if (this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
			var scrim = this.getScrim();
			if (inShow) {
				// move scrim to just under the popup to obscure rest of screen
				var i = this.getScrimZIndex();
				this._scrimZ = i;
				scrim.showAtZIndex(i);
			} else {
				scrim.hideAtZIndex(this._scrimZ);
			}
			enyo.call(scrim, "addRemoveClass", [this.scrimClassName, scrim.showing]);
		}
	},
	getScrimZIndex: function() {
		// Position scrim directly below popup
		return this.findZIndex()-1;
	},
	getScrim: function() {
		// show a transparent scrim for modal popups if scrimWhenModal is true
		// if scrim is true, then show a regular scrim.
		if (this.modal && this.scrimWhenModal && !this.scrim) {
			return moon.scrimTransparent.make();
		}
		return moon.scrim.make();
	},
	applyZIndex: function() {
		// Adjust the zIndex so that popups will properly stack on each other.
		this._zIndex = moon.Popup.count * 2 + this.findZIndex() + 1;
		// leave room for scrim
		this.applyStyle("z-index", this._zIndex);
	},
	findZIndex: function() {
		// a default z value
		var z = this.defaultZ;
		if (this._zIndex) {
			z = this._zIndex;
		} else if (this.hasNode()) {
			// Re-use existing zIndex if it has one
			z = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || z;
		}
		this._zIndex = z;
		return this._zIndex;
	}
});