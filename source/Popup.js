(function (enyo, scope) {
	/**
	* _moon.Popup_ is an [enyo.Popup]{@link enyo.Popup} that appears at the bottom of the screen and
	* takes up the full screen width.
	*
	* @class moon.Popup
	* @extends enyo.Popup
	* @public
	*/
	enyo.kind(
		/** @lends moon.Popup.prototype */ {

		/**
		* @private
		*/
		name: 'moon.Popup',

		/**
		* @private
		*/
		kind: enyo.Popup,

		/**
		* @private
		*/
		modal: true,

		/**
		* @private
		*/
		classes: 'moon moon-neutral enyo-unselectable moon-popup',

		/**
		* @private
		*/
		floating: true,

		/**
		* @private
		*/
		_bounds: null,

		/**
		* @private
		*/
		spotlight: 'container',

		/**
		* @private
		*/
		allowDefault: true,

		/**
		* @private
		*/
		handlers: {
			onRequestScrollIntoView   : '_preventEventBubble',
			ontransitionend           : 'animationEnd',
			onSpotlightSelect         : 'handleSpotlightSelect'
		},

		/**
		* @private
		*/
		eventsToCapture: {
			onSpotlightFocus: 'capturedFocus'
		},

		/**
		* @private
		*/
		published: /** @lends moon.Popup.prototype */ {
			/**
			* Determines whether a scrim will appear when the dialog is modal. If `true`,
			* {@link moon.Scrim} provides a transparent (i.e., invisible) overlay that prevents
			* propagation of tap events.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			scrimWhenModal: true,

			/**
			* Determines whether or not to display a scrim. Only displays scrims when floating. When
			* the scrim is in the floating state (`floating: true`), it covers the entire viewport
			* --i.e., it is displayed on top of other controls.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			scrim: true,

			/**
			* Optional class name to apply to the scrim. Be aware that the scrim is a singleton and
			* you will be modifying the scrim instance used for other popups.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			scrimClassName: '',

			/**
			* If `true`, spotlight (focus) cannot leave the area of the popup unless the popup is
			* explicitly closed; if `false`, spotlight may be moved anywhere within the viewport.
			* Note that setting the value of _spotlightModal_ will have no effect on spotlight
			* behavior unless the _autoDismiss_ property inherited from {@link enyo.Popup} is set to
			* `false` (default is `true`).
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			spotlightModal: false,

			/**
			* When `false`, _closeButton_ is hidden; when `true`, it is shown. When
			* [showCloseButton]{@link moon.Popup#showCloseButton} is set to "auto" (the default),
			* _closeButton_ is shown when [spotlightModal]{@link moon.Popup#spotlightModal} is
			* `true`.
			*
			* @type {String}
			* @default 'auto'
			* @public
			*/
			showCloseButton: 'auto',

			/**
			* When `true`, popups will animate on/off screen.
			*
			* @type {Boolean}
			* @default true
			* @public
			*/
			animate: true
		},

		/**
		* @private
		*/
		tools: [
			{name: 'client', classes:'enyo-fill'},
			{name: 'closeButton', kind: 'moon.IconButton', icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', showing:false}
		],

		/**
		* @private
		*/
		statics: { count: 0 },

		/**
		* @private
		*/
		defaultZ: 120,

		/**
		* @private
		*/
		activator: null,

		/**
		* @private
		*/
		directShowHide: false,

		/**
		* @private
		*/
		initialDuration: null,

		/**
		* Creates chrome
		*
		* @private
		*/
		initComponents: function() {
			this.createComponents(this.tools, {owner: this});
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		create: function () {
			this.inherited(arguments);
			this.animateChanged();
			this.initialDuration = this.getComputedStyleValue("-webkit-transition-duration", "0.4s");
		},

		/**
		* @private
		*/
		animateChanged: function() {
			if (this.animate) {
				this.animateShow();
			}
			this.addRemoveClass('animate', this.animate);
			if (!this.animate) {
				this.applyStyle('bottom', null);
				enyo.dom.transform(this, {translateY: null});
			}
		},

		/**
		* Renders _moon.Popup_, extending enyo.Popup
		*
		* @private
		*/
		render: function() {
			this.allowHtmlChanged();
			this.contentChanged();
			this.inherited(arguments);
		},

		/**
		* @private
		*/
		contentChanged: function() {
			this.$.client.setContent(this.content);
		},

		/**
		* @private
		*/
		allowHtmlChanged: function() {
			this.$.client.setAllowHtml(this.allowHtml);
		},

		/**
		* Sets _this.downEvent_ on _onSpotlightSelect_ event.
		*
		* @private
		*/
		handleSpotlightSelect: function(sender, event) {
			this.downEvent = event;
		},

		/**
		* If _this.downEvent_ is set to a spotlight event, skips normal popup _capturedTap()_ code.
		*
		* @private
		*/
		capturedTap: function(sender, event) {
			if (!this.downEvent || (this.downEvent.type !== 'onSpotlightSelect')) {
				return this.inherited(arguments);
			}
		},

		/**
		* @private
		*/
		capturedFocus: function (sender, event) {
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

			) {
				enyo.Spotlight.spot(this);
			}
			// In all other cases, the user probably means to exit the popup by moving out, so we
			// close ourselves.
			else {
				this.hide();
			}
			return true;
		},

		/**
		* Determines whether to display _closeButton_.
		*
		* @private
		*/
		configCloseButton: function() {
			if (!this.$.closeButton) { return; }

			var shouldShow = (this.showCloseButton === true || (this.spotlightModal === true && this.showCloseButton !== false));

			if (shouldShow != this.$.closeButton.getShowing()) {
				this.$.closeButton.setShowing(shouldShow);
				this.addRemoveClass('reserve-close', shouldShow);
				if (this.generated) {
					this.resize();
				}
			}
		},

		/**
		* Called if _this.spotlightModal_ changes.
		*
		* @private
		*/
		spotlightModalChanged: function() {
			this.configCloseButton();
		},

		/**
		* Called if _this.showCloseButton_ changes.
		*
		* @private
		*/
		showCloseButtonChanged: function() {
			this.configCloseButton();
		},

		/**
		* @private
		*/
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
				if(moon.Popup.count > 0) {
					moon.Popup.count--;
				}
				if (this.generated) {
					this.respotActivator();
				}
			}

			if (this.animate) {
				var args = arguments;
				if (this.showing) {
					this.inherited(arguments);
					this.animateShow();
					this.animationEnd = this.bindSafely(function(inSender, inEvent) {
						if (inEvent.originator === this) {
							if (this.directShowHide) {
								this.setDirectShowHide(false);
							}
						}
					});
				} else {
					this.animateHide();
					this.animationEnd = this.bindSafely(function(sender, event) {
						if (event.originator === this) {
							this.inherited(args);
							this.isAnimatingHide = false;
							if (this.directShowHide) {
								this.setDirectShowHide(false);
							}
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

		/**
		* Overrides the default _getShowing()_ behavior to avoid setting _this.showing_ based on the
		* CSS _display_ property.
		*
		* @private
		*/
		getShowing: function() {
			if (this.animate) {
				return this.showing;
			} else {
				return this.inherited(arguments);
			}
		},

		/**
		* Skips animation and jumps to the final shown state.
		*
		* @public
		*/
		showDirect: function() {
			if (this.animate) {
				this.setDirectShowHide(true);
			}
			this.show();
		},

		/**
		* Skips animation and jumps to the final hidden state.
		*
		* @public
		*/
		hideDirect: function() {
			if (this.animate) {
				this.setDirectShowHide(true);
			}
			this.hide();
		},

		/**
		* @private
		*/
		setDirectShowHide: function(value) {
			this.directShowHide = value;
			// setting duration to "0" does not work, nor does toggling animate property
			var duration = (value) ? "0.0001s" : this.initialDuration;
			this.applyStyle("-webkit-transition-duration", duration);
		},

		/**
		* @private
		*/
		showHideScrim: function(show) {
			if (this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
				var scrim = this.getScrim();
				if (show && this.modal && this.scrimWhenModal) {
					// move scrim to just under the popup to obscure rest of screen
					var i = this.getScrimZIndex();
					this._scrimZ = i;
					scrim.showAtZIndex(i);
				} else {
					scrim.hideAtZIndex(this._scrimZ);
				}
				enyo.call(scrim, 'addRemoveClass', [this.scrimClassName, scrim.showing]);
			}
		},

		/**
		* @private
		*/
		getScrimZIndex: function() {
			// Position scrim directly below popup
			return this.findZIndex()-1;
		},

		/**
		* @private
		*/
		getScrim: function() {
			// show a transparent scrim for modal popups if scrimWhenModal is true
			// if scrim is true, then show a regular scrim.
			if (this.modal && this.scrimWhenModal && !this.scrim) {
				return moon.scrimTransparent.make();
			}
			return moon.scrim.make();
		},

		/**
		* @private
		*/
		applyZIndex: function() {
			// Adjust the zIndex so that popups will properly stack on each other.
			this._zIndex = moon.Popup.count * 2 + this.findZIndex() + 1;
			// leave room for scrim
			this.applyStyle('z-index', this._zIndex);
		},

		/**
		* @private
		*/
		findZIndex: function() {
			// a default z value
			var z = this.defaultZ;
			if (this._zIndex) {
				z = this._zIndex;
			} else if (this.hasNode()) {
				// Re-use existing zIndex if it has one
				z = Number(enyo.dom.getComputedStyleValue(this.node, 'z-index')) || z;
			}
			this._zIndex = z;
			return this._zIndex;
		},

		/**
		* Removes focus style from _closeButton_ and hides the _moon.Popup_.
		*
		* @private
		*/
		closePopup: function(sender, event) {
			if (this.$.closeButton) {
				this.$.closeButton.removeClass('pressed');
			}
			this.hide();
		},

		/**
		* Attempts to respot _this.activator_ when _moon.Popup_ is hidden.
		*
		* @private
		*/
		respotActivator: function() {
			var a = this.activator;
			// We're about to spot something, so we first call release() to avoid capturing
			// (and preventing) the resulting SpotlightFocus event.
			this.release();
			// Attempt to identify and re-spot the activator if present
			if (a && !a.destroyed) {
				enyo.Spotlight.spot(a);
				if (a instanceof moon.Button) {
					a.removeClass('pressed');
				}
			} else {
				// As a failsafe, attempt to spot the container if no activator is present
				enyo.Spotlight.spot(enyo.Spotlight.getFirstChild(this.container));
			}
			this.activator = null;
		},

		/**
		* @private
		*/
		_preventEventBubble: function(sender, event) {
			return true;
		},

		/**
		* @private
		*/
		animateShow: function () {
			this._bounds = this.getBounds();
			this.applyStyle('bottom', -this._bounds.height + 'px');
			enyo.dom.transform(this, {translateY: -this._bounds.height + 'px'});
		},

		/**
		* @private
		*/
		animateHide: function () {
			if (this._bounds) {
				this.isAnimatingHide = true;
				var prevHeight = this._bounds.height;
				this._bounds = this.getBounds();
				enyo.dom.transform(this, {translateY: this._bounds.height - prevHeight + 'px'});
			}
		},

		/**
		* @private
		*/
		destroy: function() {
			this.showHideScrim(false);
			this.inherited(arguments);
		}
	});

})(enyo, this);
