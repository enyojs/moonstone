/**
	_moon.Popup_ is an [enyo.Popup](#enyo.Popup) that appears at the bottom of the
	screen and takes up the full screen width.
*/
enyo.kind({
	name : "moon.Popup",
	kind : enyo.Popup,

	//* @protected
	modal     : true,
	classes   : "moon moon-neutral enyo-unselectable moon-popup",
	floating  : true,
	_bounds   : null,
	spotlight : "container",
	allowDefault: true,

	handlers: {
		onRequestScrollIntoView   : "_preventEventBubble",
		ontransitionend           : "animationEnd",
		onSpotlightSelect         : "handleSpotlightSelect"
	},

	eventsToCapture: { 
		onSpotlightFocus: "capturedFocus"
	},

	events: {
		//* Fires after the animation is complete when the popup is shown.
		onShown: "",
		//* Fires before the animation starts when the popup is hidden.
		onHiding: ""
	},

	//* @public
	published: {
		/**
			Determines whether a scrim will appear when the dialog is modal.
			If true, _moon.Scrim_ provides a transparent (i.e., invisible)
			overlay that prevents propagation of tap events.
		*/
		scrimWhenModal: true,
		/**
			Determines whether or not to display a scrim. Only displays scrims when
			floating. When the scrim is in the floating state (_floating: true_), it
			covers the entire viewport--i.e., it is displayed on top of other
			controls.
		*/
		scrim: true,
		/**
			Optional class name to apply to the scrim. Be aware that the scrim
			is a singleton and you will be modifying the scrim instance used for
			other popups.
		*/
		scrimClassName: "",
		/**
			If true, spotlight (focus) cannot leave the area of the popup unless the
			popup is explicitly closed; if false, spotlight may be moved anywhere
			within the viewport. Note that setting the value of _spotlightModal_ will
			have no effect on spotlight behavior unless the _autoDismiss_ property
			inherited from _enyo.Popup_ is set to false (default is true).
		*/
		spotlightModal: false,
		/**
			When false, _closeButton_ is hidden; when true, it is shown. When
			_showCloseButton_ is set to "auto" (the default), _closeButton_ is shown
			when _spotlightModal_ is true.
		*/
		showCloseButton: "auto",
		//* When true, popups will animate on/off screen
		animate: true
	},
	//* @protected
	tools: [
		{name: "client", classes:"enyo-fill"},
		{name: "closeButton", kind: "moon.IconButton", icon: "closex", classes: "moon-popup-close", ontap: "closePopup", showing:false}
	],
	statics: { count: 0 },
	defaultZ: 120,
	activator: null,
	//* Creates chrome
	initComponents: function() {
		this.createComponents(this.tools, {owner: this});
		this.inherited(arguments);
	},
	create: function () {
		this.inherited(arguments);
		this.animateChanged();
	},
	animateChanged: function() {
		if (this.animate) {
			this.animateShow();
		}
		this.addRemoveClass("animate", this.animate);
		//this.addRemoveClass("animate", this.animate);
		if (!this.animate) {
			this.applyStyle("bottom", null);
			enyo.dom.transform(this, {translateY: null});
		}
	},
	//* Renders _moon.Popup_, extending enyo.Popup
	render: function() {
		this.allowHtmlChanged();
		this.contentChanged();
		this.inherited(arguments);
	},
	contentChanged: function() {
		this.$.client.setContent(this.content);
	},
	allowHtmlChanged: function() {
		this.$.client.setAllowHtml(this.allowHtml);
	},
	//* Sets _this.downEvent_ on _onSpotlightSelect_ event.
	handleSpotlightSelect: function(inSender, inEvent) {
		this.downEvent = inEvent;
	},
	//* If _this.downEvent_ is set to a spotlight event, skips normal popup
	//* capturedTap()_ code.
	capturedTap: function(inSender, inEvent) {
		if (!this.downEvent || (this.downEvent.type !== "onSpotlightSelect")) {
			return this.inherited(arguments);
		}
	},
	capturedFocus: function (inSender, inEvent) {
	// While we're open, we hijack Spotlight focus events. In all cases, we want
	// to prevent the default 5-way behavior (which is to focus on the control nearest
	// to the pointer in the chosen direction)...
	var last = enyo.Spotlight.getLastControl(),
		cur = enyo.Spotlight.getCurrent();
	// There are two cases where we want to focus back on ourselves...
	// NOTE: The logic used here to detect these cases is highly dependent on certain
	// nuances of how Spotlight currently tracks the "last" and "current" focus. It will
	// probably need to be updated if / when Spotlight gets some love in this area.
	if (
		// Case 1: We were probably just opened in pointer mode. The pointer is outside
		// the popup, which means a 5-way press will likely focus some control outside the
		// popup, unless we prevent it by re-spotting ourselves.
		//(last === this && !cur.isDescendantOf(this)) ||
		(last === this && cur === this.activator) ||
		// Case 2: We were probably opened in 5-way mode and then the pointer was moved
		// (likely due to incidental movement of the magic remote). It's possible that the
		// user actually wants to exit the popup by focusing on something outside, but more
		// likely that they have accidentally wiggled the remote and intend to be moving
		// around within the popup -- so, again, we re-spot ourselves.
		(last.isDescendantOf(this) && cur !== this)

	){
		enyo.Spotlight.spot(this);
	}
	// In all other cases, the user probably means to exit the popup by moving out, so we
	// close ourselves.
	else {
		this.hide();
	}
	return true;
	},
	//* Determines whether to display _closeButton_.
	configCloseButton: function() {
		if (!this.$.closeButton) { return; }

		var shouldShow = (this.showCloseButton === true || (this.spotlightModal === true && this.showCloseButton !== false));

		if (shouldShow != this.$.closeButton.getShowing()) {
			this.$.closeButton.setShowing(shouldShow);
			this.addRemoveClass("reserve-close", shouldShow);
			if (this.generated) {
				this.resize();
			}
		}
	},
	//* Called if _this.spotlightModal_ changes.
	spotlightModalChanged: function() {
		this.configCloseButton();
	},
	//* Called if _this.showCloseButton_ changes.
	showCloseButtonChanged: function() {
		this.configCloseButton();
	},
	showingChanged: function() {
		if (this.showing) {
			if (this.animate) {
				// need to call this early to prevent race condition where animationEnd
				// originated from a "hide" context but we are already in a "show" context
				this.animationEnd = enyo.nop;
				// if we are currently animating the hide transition, release
				// the events captured when popup was initially shown
				if (this.isAnimatingHide) {
					if (this.captureEvents) {
						this.release();
					}
					this.isAnimatingHide = false;
				}
			}
			this.activator = enyo.Spotlight.getCurrent();
			moon.Popup.count++;
			this.applyZIndex();
		}
		else {
			this.doHiding();

			if(moon.Popup.count > 0) {
				moon.Popup.count--;
			}
			if (this.generated) {
				this.respotActivator();
			}
		}

		if (this.animate) {
			if (this.showing) {
				this.inherited(arguments);
				this.animateShow();
				this.animationEnd = this.bindSafely(function(inSender, inEvent) {
					if (inEvent.originator === this) {
						this.doShown();
					}
				});
			} else {
				this.animateHide();
				var args = arguments;
				this.animationEnd = this.bindSafely(function(inSender, inEvent) {
					if (inEvent.originator === this) {
						this.inherited(args);
						this.isAnimatingHide = false;
					}
				});
			}
		} else {
			this.inherited(arguments);
		}

		this.showHideScrim(this.showing);
		if (this.showing) {
			this.configCloseButton();
			// Spot ourselves, unless we're already spotted
			var current = enyo.Spotlight.getCurrent(); 
			if (!current || !current.isDescendantOf(this)) {
				if (enyo.Spotlight.isSpottable(this)) {
					enyo.Spotlight.spot(this);
				}
				// If we're not spottable, just unspot whatever was previously spotted
				else {
					enyo.Spotlight.unspot();
				}
			}
		}
	},
	getShowing: function() {
		//* Override default _getShowing()_ behavior to avoid setting _this.showing_ based on the CSS _display_ property
		if (this.animate) {
			return this.showing;
		} else {
			return this.inherited(arguments);
		}
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
	},
	//* Removes focus style from _closeButton_ and hides the _moon.Popup_.
	closePopup: function(inSender, inEvent) {
		if (this.$.closeButton) {
			this.$.closeButton.removeClass("pressed");
		}
		this.hide();
	},
	//* Attempts to respot _this.activator_ when _moon.Popup_ is hidden.
	respotActivator: function() {
		var a = this.activator;
		// We're about to spot something, so we first call release() to avoid capturing
		// (and preventing) the resulting SpotlightFocus event.
		this.release();
		// Attempt to identify and re-spot the activator if present
		if (a && !a.destroyed) {
			enyo.Spotlight.spot(a);
			if (a instanceof moon.Button) {
				a.removeClass("pressed");
			}
		} else {
			// As a failsafe, attempt to spot the container if no activator is present
			enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.container));
		}
		this.activator = null;
	},
	//*@protected
	_preventEventBubble: function(inSender, inEvent) {
		return true;
	},
	animateShow: function () {
		this._bounds = this.getBounds();
		this.applyStyle("bottom", -this._bounds.height + "px");
		enyo.dom.transform(this, {translateY: -this._bounds.height + "px"});
	},
	animateHide: function () {
		if (this._bounds) {
			this.isAnimatingHide = true;
			var prevHeight = this._bounds.height;
			this._bounds = this.getBounds();
			enyo.dom.transform(this, {translateY: this._bounds.height - prevHeight + "px"});
		}
	},
	destroy: function() {
		this.showHideScrim(false);
		this.inherited(arguments);
	}
});
