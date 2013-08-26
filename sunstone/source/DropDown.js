/**
	_sun.DropDown_ is a popup window control with Sunstone visual styling
	applied.  It extends <a href="#enyo.Popup">enyo.Popup</a> and is designed to
	be used with <a href="#sun.DropDownDecorator">sun.DropDownDecorator</a>.
*/
enyo.kind({
	name: "sun.DropDown",
	kind: "sun.Popup",
	classes: "sun-drop-down",
	layoutKind: "ContextualLayout",	
	handlers: {
		onRequestShowPopup: "requestShow",
		onRequestHidePopup: "requestHide",
		onActivate: "decorateActivateEvent",
		onSpotlightUp: "spotlightUp",
		onSpotlightDown: "spotlightDown",
		onSpotlightLeft: "spotlightLeft",
		onSpotlightRight: "spotlightRight",
		onSpotlightSelect: "spotSelect",
		onRequestScrollIntoView: "_preventEventBubble"
	},
	published: {
		/**
			When true, spotlight cannot leave the constraints of the _moon.Popup_
			unless it is explicitly closed.
		*/
		spotlightModal: false,
		/**
			When false, _closeButton_ is hidden; when true, it is shown. When
			_showCloseButton_ is set to "auto" (the default), _closeButton_ is shown
			when _spotlightModal_ is true.
		*/
		showCloseButton: false,
		scrim: false
	},
	tools: [
		{name: "client" },
		{name: "closeButton", kind: "sun.Button", classes: "sun-popup-close", ontap: "closePopup", spotlight: false}
	],
	spotlight: "container",
	//* @protected
	_spotlight: null,
	floating: true,
	//layout parameters
	vertFlushMargin: 0, //vertical flush layout margin
	horizFlushMargin: 0, //horizontal flush layout margin
	widePopup: 200, //popups wider than this value are considered wide (for layout purposes)
	longPopup: 200, //popups longer than this value are considered long (for layout purposes)
	horizBuffer: 16, //do not allow horizontal flush popups past spec'd amount of buffer space on left/right screen edge
	activator: null,
	
	//* Creates chrome.
	initComponents: function() {
		//this.createChrome(this.tools);
		this.inherited(arguments);
	},
	//* Performs control-specific tasks before/after showing _moon.ContextualPopup_.
	requestShow: function(inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		this.activator = inEvent.activator;
		this.spotlight = this._spotlight;
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		this.configCloseButton();
		this.configSpotlightBehavior(true);
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
		Dismisses popup if Escape keypress is detected.
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
	//* Renders the contextual popup.
	render: function() {
		this.allowHtmlChanged();
		this.contentChanged();
		this.inherited(arguments);
		this._spotlight = this.spotlight;
	},
	closePopup: function(inSender, inEvent) {
		enyo.Spotlight.spot(this.activator);
		this.$.closeButton.removeClass("pressed");
		this.hide();
	},
	//* Determines whether to display _closeButton_.
	configCloseButton: function() {
		if (this.showCloseButton === true || (this.spotlightModal && this.closeButton !== false)) {
			this.activator.keepOpen = true;
			this.$.closeButton.show();
			this.$.closeButton.spotlight = true;
		} else {
			this.$.closeButton.hide();
			this.$.closeButton.spotlight = false;
		}
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	},
	allowHtmlChanged: function() {
		this.$.client.setAllowHtml(this.allowHtml);
	},
	//* Spotlights the first spottable control, if possible.
	configSpotlightBehavior: function(spotChild) {
		if (enyo.Spotlight.getChildren(this).length > 0) {
			if (spotChild) enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this));
		} else if (!this.spotlightModal) {
			this.activator.keepOpen = false;
			this.spotlight = false;
		}
	},
	//* Called when _this.spotlight_ changes.
	spotlightChanged: function() {
		this._spotlight = this.spotlight;
		this.configSpotlightBehavior(false);
	},
	//* Called when _this.spotlightModal_ changes.
	spotlightModalChanged: function() {
		this.configCloseButton();
	},
	//* Called when _this.showCloseButton_ changes.
	showCloseButtonChanged: function() {
		this.configCloseButton();
	},
	spotSelect: function(inSender, inEvent) {
		this.downEvent = inEvent;
	},
	/**
		Checks whether to allow spotlight to move in a given direction.
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
	},
	//*@protected
	_preventEventBubble: function(inSender, inEvent) {
		return true;
	}
});
