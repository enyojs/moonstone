/**
	_moon.ContextualPopup_ is a popup window control with Moonstone visual styling
	applied.  It extends [enyo.Popup](#enyo.Popup) and is designed to be used with
	[moon.ContextualPopupDecorator](#moon.ContextualPopupDecorator).
*/
enyo.kind({
	name : "moon.ContextualPopup",
	kind : "enyo.Popup",
	
	//* @protected
	layoutKind : "ContextualLayout",
	classes    : "moon-body-text moon-contextual-popup",
	
	handlers: {
		onRequestShowPopup        : "requestShow",
		onRequestHidePopup        : "requestHide",
		onActivate                : "decorateActivateEvent",
		onRequestScrollIntoView   : "_preventEventBubble",
		onSpotlightContainerLeave : "onLeave",
		onSpotlightKeyDown        : "onSpotlightKeyDown"
	},
	//* @public
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
		showCloseButton: "auto"
	},
	//* @protected
	spotlight: "container",
	floating:true,
	/**
		Determines whether a scrim will appear when the popup is modal.
		Note that modal scrims are transparent, so you won't see them.
	*/
	scrimWhenModal: true,
	// Layout parameters
	
	//* Vertical flush layout margin
	vertFlushMargin:0,
	//* Horizontal flush layout margin
	horizFlushMargin:0,
	//* Popups wider than this value are considered wide (for layout purposes)
	widePopup: 200,
	//* Popups longer than this value are considered long (for layout purposes)
	longPopup: 200,
	//* Do not allow horizontal flush popups past spec'd amount of buffer space on left/right screen edge
	horizBuffer: 16,
	activator: null,
	tools: [
		{name: "client", classes: "moon-neutral moon-contextual-popup-client"},
		{name: "closeButton", kind: "moon.IconButton", icon: "closex", classes: "moon-popup-close", ontap: "closePopup", spotlight: false}
	],
	//* Creates chrome.
	initComponents: function() {
		this.createChrome(this.tools);
		this.inherited(arguments);
		this.eventsToCapture = enyo.clone(this.eventsToCapture);
		this.eventsToCapture.onSpotlightKeyDown = "capturedKeyDown";
	},
	//* Renders the contextual popup.
	render: function() {
		this.allowHtmlChanged();
		this.contentChanged();
		this.inherited(arguments);
	},
	//* Performs control-specific tasks before/after showing _moon.ContextualPopup_.
	requestShow: function(inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		this.activator = inEvent.activator;
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		this.configCloseButton();
		if (enyo.Spotlight.isSpottable(this)) {
			enyo.Spotlight.setPointerMode(false);
			enyo.Spotlight.spot(this);
		}
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
	//* Dismisses popup if Escape keypress is detected
	keydown: function(inSender, inEvent) {
		if (this.showing && this.autoDismiss && inEvent.keyCode == 27 /* escape */) {
			enyo.Spotlight.spot(this.activator);
			this.hide();
		}
	},
	closePopup: function(inSender, inEvent) {
		enyo.Spotlight.spot(this.activator);
		this.$.closeButton.removeClass("pressed");
		this.hide();
	},
	//* Determines whether to display _closeButton_.
	configCloseButton: function() {
		if (this.showCloseButton === true || (this.spotlightModal && this.showCloseButton !== false)) {
			this.$.closeButton.show();
			this.$.closeButton.spotlight = true;
			this.addClass("reserve-close");
		} else {
			this.$.closeButton.hide();
			this.$.closeButton.spotlight = false;
			this.removeClass("reserve-close");
		}
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	},
	allowHtmlChanged: function() {
		this.$.client.setAllowHtml(this.allowHtml);
	},
	//* Called when _this.spotlightModal_ changes.
	spotlightModalChanged: function() {
		this.configCloseButton();
	},
	//* Called when _this.showCloseButton_ changes.
	showCloseButtonChanged: function() {
		this.configCloseButton();
	},
	capturedKeyDown: function(inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.downEvent = inEvent;
		}
		return this.modal;
	},
	onLeave: function(oSender, oEvent) {
		if (oEvent.originator == this) {
			enyo.Spotlight.spot(this.activator);
			this.hide();
		}
	},
	onSpotlightKeyDown: function(inSender, inEvent) {
		// Inform other controls that spotlight event was generated within a container
		inEvent.spotSentFromContainer = this.spotlight === "container";
	},
	_preventEventBubble: function(inSender, inEvent) {
		return true;
	},
	showHideScrim: function(inShow) {
		if (this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
			var scrim = this.getScrim();
			if (inShow && this.modal && this.scrimWhenModal) {
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
		if (this.modal && this.scrimWhenModal) {
			return moon.scrimTransparent.make();
		}
		return moon.scrim.make();
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
	},
	showingChanged: function() {
		this.inherited(arguments);
		this.showHideScrim(this.showing);
	}
});
