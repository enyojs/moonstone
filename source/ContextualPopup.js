/**
	_moon.ContextualPopup_ is a popup window control with Moonstone visual styling
	applied.  It extends <a href="#enyo.Popup">enyo.Popup</a> and is designed to
	be used with <a href="#moon.ContextualPopupDecorator">moon.ContextualPopupDecorator</a>.
*/
enyo.kind({
	name: "moon.ContextualPopup",
	kind: "enyo.Popup",
	layoutKind: "ContextualLayout",
	classes: "moon-contextual-popup",
	handlers: {
		onRequestShowPopup: "requestShow",
		onRequestHidePopup: "requestHide",
		onActivate: "decorateActivateEvent",
		onSpotlightUp: "spotlightUp",
		onSpotlightDown: "spotlightDown",
		onSpotlightLeft: "spotlightLeft",
		onSpotlightRight: "spotlightRight",
		onSpotlightSelect: "spotSelect"
	},
	published: {
		spotlight: "container",
		spotlightModal: false
	},
	//* @protected
	_spotlight: null,
	floating:true,
	//layout parameters
	vertFlushMargin:0, //vertical flush layout margin
	horizFlushMargin:0, //horizontal flush layout margin
	widePopup:200, //popups wider than this value are considered wide (for layout purposes)
	longPopup:200, //popups longer than this value are considered long (for layout purposes)
	horizBuffer:16, //do not allow horizontal flush popups past spec'd amount of buffer space on left/right screen edge
	activator: null,
	requestShow: function(inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		this.activator = inEvent.activator;
		this.spotlight = this._spotlight;
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		this.configureSpotlightModal();
		this.configSpotlightBehavior(true);
		return true;
	},
	requestHide: function(inSender, inEvent) {
		this.hide();
		return true;
	},
	decorateActivateEvent: function(inSender, inEvent) {
		inEvent.sentFromPopup = this;
	},
	getPageOffset: function(inNode) {
		// getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
		var r = inNode.getBoundingClientRect();

		var pageYOffset = (window.pageYOffset === undefined) ? document.documentElement.scrollTop : window.pageYOffset;
		var pageXOffset = (window.pageXOffset === undefined) ? document.documentElement.scrollLeft : window.pageXOffset;
		var rHeight = (r.height === undefined) ? (r.bottom - r.top) : r.height;
		var rWidth = (r.width === undefined) ? (r.right - r.left) : r.width;

		return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth};
	},
	/**
		When hitting Esc to dismiss the popup
	*/
	keydown: function(inSender, inEvent) {
		if (this.showing && this.autoDismiss && inEvent.keyCode == 27 /* escape */) {
			enyo.Spotlight.spot(this.activator);
			this.hide();
		}
	},
	//* If _this.downEvent_ is set to a spotlight event, skips normal popup
	//* _tap()_ code.
	tap: function(inSender, inEvent) {
		if (this.downEvent.type !== "onSpotlightSelect") {
			return this.inherited(arguments);
		}
	},
	//* Renders _moon.ContextualPopup_ and creates needed _moon.Button_ component.
	render: function() {
		this.createComponent({name: "closeButton", kind: "moon.Button", classes: "moon-popup-close", ontap: "closePopup", spotlight: false});
		this.inherited(arguments);
		this._spotlight = this.spotlight;
	},
	closePopup: function(inSender, inEvent) {
		enyo.Spotlight.spot(this.activator);
		this.$.closeButton.removeClass("pressed");
		this.hide();
	},
	configureSpotlightModal: function() {
		if (this.spotlightModal) {
			this.activator.setKeepOpen(true);
			this.$.closeButton.show();
			this.$.closeButton.spotlight = true;
		} else {
			this.$.closeButton.hide();
			this.$.closeButton.spotlight = false;
		}
	},
	configSpotlightBehavior: function(spotChild) {
		if (enyo.Spotlight.getChildren(this).length > 0) {
			if (spotChild) enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this));
		} else if (!this.spotlightModal) {
			this.activator.setKeepOpen(false);
			this.spotlight = false;
		}
	},
	spotlightChanged: function() {
		this._spotlight = this.spotlight;
		this.configSpotlightBehavior(false);
	},
	spotlightModalChanged: function() {
		this.configureSpotlightModal();
	},
	spotSelect: function(inSender, inEvent) {
		this.downEvent = inEvent;
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
				enyo.Spotlight.spot(this.activator);
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
