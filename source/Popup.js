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
	_spotlight: null,
	spotlight: "container",
	handlers: {
		onSpotlightSelect: "spotSelect",
		onSpotlightUp: "spotlightUp",
		onSpotlightDown: "spotlightDown",
		onSpotlightLeft: "spotlightLeft",
		onSpotlightRight: "spotlightRight"
	},
	//* @public
	published: {
		spotlightModal: false
	},

	//* @protected
	//* Renders _moon.Popup_ and creates needed _moon.Button_ component.
	render: function() {
		this.createComponent({name: "closeButton", kind: "moon.Button", classes: "moon-popup-close", ontap: "closePopup", spotlight: false});
		this.inherited(arguments);
		this._spotlight = this.spotlight;
	},
	spotlightModalChanged: function() {
		if (this.spotlightModal) {
			this.$.closeButton.show();
			this.$.closeButton.spotlight = true;
		} else {
			this.$.closeButton.hide();
			this.$.closeButton.spotlight = false;
		}
	},
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
	//* If _this.showing_ changes, perform spotlight-specific tasks
	showingChanged: function() {	
		this.inherited(arguments);
		if (this.showing) {
			this.spotlight = this._spotlight;
			this.spotlightModalChanged();
			var spottableChildren = enyo.Spotlight.getChildren(this).length;
			if (spottableChildren === 0) {
				this.spotlight = false;
			} else if ((this.spotlight) && (spottableChildren > 0)) {
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this));
			}
		}
	},
	closePopup: function(inSender, inEvent) {
		this.$.closeButton.removeClass("pressed");
		this.spotlight = false;
		this.hide();
	},
	/**
		Check whether to allow spotlight to move to any given direction.
	*/
	spotChecker: function(inDirection) {
		var neighbor = enyo.Spotlight.NearestNeighbor.getNearestNeighbor(inDirection);
		if (!enyo.Spotlight.Util.isChild(this, neighbor)) {
			if (this.spotlightModal) {
				return true;
			} else {
				this.spotlight = false;
				this.hide();
			}
		}
	},
	/**
		When spotlight reaches top edge of popup, prevents user from
		continuing further.
	*/
	spotlightUp: function(inSender, inEvent) {
		return this.spotChecker("UP");
	},
	/**
		When spotlight reaches bottom edge of popup, prevents user from
		continuing further.
	*/
	spotlightDown: function(inSender, inEvent) {
		return this.spotChecker("DOWN");
	},
	/**
		When spotlight reaches left edge of popup, prevents user from
		continuing further.
	*/
	spotlightLeft: function(inSender, inEvent) {
		return this.spotChecker("LEFT");
	},
	/**
		When spotlight reaches right edge of popup, prevents user from
		continuing further.
	*/
	spotlightRight: function(inSender, inEvent) {
		return this.spotChecker("RIGHT");
	}
});