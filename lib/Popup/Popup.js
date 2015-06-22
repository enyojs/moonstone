require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Popup~Popup} kind.
* @module moonstone/Popup
*/

var
	kind = require('enyo/kind'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	Popup = require('enyo/Popup');

var
	Spotlight = require('spotlight');

var
	Scrim = require('../Scrim'),
	Button = require('../Button'),
	IconButton = require('../IconButton'),
	MoonHistory = require('../History'),
	HistorySupport = MoonHistory.HistorySupport;

/**
* {@link module:moonstone/Popup~Popup} is an {@link module:enyo/Popup~Popup} that appears at the bottom of the
* screen and takes up the full screen width.
*
* @class Popup
* @extends module:enyo/Popup~Popup
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Popup~Popup.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Popup',

	/**
	* @private
	*/
	kind: Popup,

	/**
	* @private
	*/
	mixins : [HistorySupport],

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
		onSpotlightFocus: 'capturedFocus',
		onkeydown: 'captureKeyDown'
	},

	/**
	* @private
	* @lends module:moonstone/Popup~Popup.prototype
	*/
	published: {
		/**
		* Determines whether a scrim will appear when the dialog is modal. If `true`,
		* a transparent (i.e., invisible) overlay prevents the propagation of tap events.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		scrimWhenModal: true,

		/**
		* Determines whether or not to display a scrim. Only displays scrims when floating. When
		* the scrim is in the floating state (`floating: true`), it covers the entire viewport
		* (i.e., it is displayed on top of other controls).
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
		* If `true`, {@glossary Spotlight} (focus) cannot leave the area of the popup unless the
		* popup is explicitly closed; if `false`, spotlight may be moved anywhere within the
		* viewport.  Note that setting the value of `spotlightModal` will have no effect on
		* spotlight behavior unless the [autoDismiss]{@link module:enyo/Popup~Popup#autoDismiss} property
		* inherited from {@link module:enyo/Popup~Popup} is set to `false` (default is `true`).
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		spotlightModal: false,

		/**
		* When `false`, the close button is hidden; when `true`, it is shown. When
		* `showCloseButton` is set to `'auto'` (the default), the close button is shown when
		* [spotlightModal]{@link module:moonstone/Popup~Popup#spotlightModal} is `true`.
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
		{name: 'client', kind: Control, classes:'enyo-fill'},
		{name: 'closeButton', kind: IconButton, icon: 'closex', backgroundOpacity: 'transparent', classes: 'moon-popup-close', ontap: 'closePopup', showing:false}
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
	* Creates chrome components.
	*
	* @private
	*/
	initComponents: function() {
		this.createComponents(this.tools, {owner: this});
		Popup.prototype.initComponents.apply(this, arguments);
	},

	/**
	* @private
	*/
	create: function () {
		this.inherited(arguments);
		this.animateChanged();
	},

	/**
	* @private
	*/
	animateChanged: function() {
		this.addRemoveClass('animate', this.animate);
		if (!this.animate) {
			this.applyStyle('bottom', null);
		}
	},

	/**
	* Renders `moon.Popup`, extending enyo.Popup
	*
	* @private
	*/
	render: function() {
		this.allowHtmlChanged();
		this.contentChanged();
		Popup.prototype.render.apply(this, arguments);
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
	* Sets `this.downEvent` on `onSpotlightSelect` event.
	*
	* @private
	*/
	handleSpotlightSelect: function(sender, event) {
		this.downEvent = event;
	},

	/**
	* If `this.downEvent` is set to a {@glossary Spotlight} event, skips normal popup
	* `capturedTap()` code.
	*
	* @private
	*/
	capturedTap: function(sender, event) {
		if (!this.downEvent || (this.downEvent.type != 'onSpotlightSelect')) {
			Popup.prototype.capturedTap.apply(this, arguments);
		}
	},

	/**
	* If the popup has no spottable children, an [Enter] key down will cause it to be hidden
	* because Spotlight will try to spot the nearest or last control for a 5-way key down.
	* Since there isn't a spottable child, a control outside the popup is focused which triggers
	* `capturedFocus` which hides the Popup.
	*
	* @private
	*/
	captureKeyDown: function (sender, event) {
		this.preventHide = (event.keyCode == 13 || event.keyCode == 16777221) && !Spotlight.isSpottable(this);
	},

	/**
	* @private
	*/
	capturedFocus: function (sender, event) {
		// While we're open, we hijack Spotlight focus events. In all cases, we want
		// to prevent the default 5-way behavior (which is to focus on the control nearest
		// to the pointer in the chosen direction)...
		var last = Spotlight.getLastControl(),
			cur = Spotlight.getCurrent(),
			focusCapturedControl = event.originator;
		// There are two cases where we want to focus back on ourselves...
		// NOTE: The logic used here to detect these cases is highly dependent on certain
		// nuances of how Spotlight currently tracks the "last" and "current" focus. It will
		// probably need to be updated if / when Spotlight gets some love in this area.
		if (
			// Case 1: We were probably just opened in pointer mode. The pointer is outside
			// the popup, which means a 5-way press will likely focus some control outside the
			// popup, unless we prevent it by re-spotting ourselves.
			//(last === this && !cur.isDescendantOf(this)) ||
			(last === this && !focusCapturedControl.isDescendantOf(this)) ||
			// Case 2: We were probably opened in 5-way mode and then the pointer was moved
			// (likely due to incidental movement of the magic remote). It's possible that the
			// user actually wants to exit the popup by focusing on something outside, but more
			// likely that they have accidentally wiggled the remote and intend to be moving
			// around within the popup -- so, again, we re-spot ourselves.
			(last.isDescendantOf(this) && cur !== this)

		) {
			Spotlight.spot(this);
		}
		// In all other cases, the user probably means to exit the popup by moving out, so we
		// close ourselves.
		else if (!this.preventHide) {
			this.hide();
		}
		return true;
	},

	/**
	* Determines whether to display close button.
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
	* Called if [spotlightModal]{@link module:moonstone/Popup~Popup#spotlightModal} changes.
	*
	* @private
	*/
	spotlightModalChanged: function() {
		this.configCloseButton();
	},

	/**
	* Called if [showCloseButton]{@link module:moonstone/Popup~Popup#showCloseButton} changes.
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
		// reset flag to prevent hiding popup when Enter pressed on unspottable popup
		this.preventHide = false;

		if (this.showing) {
			if (this.isAnimatingHide) {
				// need to call this early to prevent race condition where animationEnd
				// originated from a "hide" context but we are already in a "show" context
				this.animationEnd = util.nop;
				Popup.count--;
				// if we are currently animating the hide transition, release
				// the events captured when popup was initially shown
				if (this.captureEvents) {
					this.release();
				}
				this.isAnimatingHide = false;
			}
			this.activator = Spotlight.getCurrent();
		}
		else {
			if (this.generated) {
				this.respotActivator();
			}
		}

		if (this.showing) {
			// Run inherited immediately
			Popup.prototype.showingChanged.apply(this, arguments);
			this.show();
		} else {
			this.hide();
			if (this.animate) {
				this.isAnimatingHide = true;
				// Instead of hiding the scrim with the inherited enyo method, when the
				// animation is finished, fire it now, so interactive control is returned to the
				// applicaiton while our popup is animating to the closed position.
				this.showHideScrim(this.showing);
				var args = arguments;
				this.animationEnd = this.bindSafely(function (sender, ev) {
					if (ev.originator === this) {
						// Delay inherited until animationEnd
						Popup.prototype.showingChanged.apply(this, args);
						this.animationEnd = util.nop;
						this.isAnimatingHide = false;
					}
				});
			} else {
				// Run inherited immediately
				Popup.prototype.showingChanged.apply(this, arguments);
			}
		}

		if (this.showing) {
			this.configCloseButton();
			// Spot ourselves, unless we're already spotted
			var current = Spotlight.getCurrent();
			if (!current || !current.isDescendantOf(this)) {
				if (Spotlight.isSpottable(this)) {
					Spotlight.spot(this);
				}
				// If we're not spottable, just unspot whatever was previously spotted
				else {
					Spotlight.unspot();
				}
			}
		}

		if (this.allowBackKey) {
			if (this.showing) {
				this.pushBackHistory();
			} else if(!this.showing && !MoonHistory.isHandlingBackAction()) {
				MoonHistory.ignorePopState();
			}
		}
	},

	/**
	* Show the popup. This respects the current state of the
	* [animate]{@link module:moonstone/Popup~Popup#animate} property, showing with or without animation.
	*
	* @public
	*/
	show: function() {
		Popup.prototype.show.apply(this, arguments);
		this.addClass('showing');
	},

	/**
	* Hide the popup. This respects the current state of the
	* [animate]{@link module:moonstone/Popup~Popup#animate} property, hiding with or without animation.
	*
	* @public
	*/
	hide: function() {
		Popup.prototype.hide.apply(this, arguments);
		this.removeClass('showing');
	},

	/**
	* Overrides the default `getShowing()` behavior to avoid setting `this.showing` based on the
	* CSS `display` property.
	*
	* @private
	*/
	getShowing: function() {
		if (this.animate) {
			return this.showing;
		} else {
			Popup.prototype.getShowing.apply(this, arguments);
		}
	},

	/**
	* Skips animation and jumps to the final shown state.
	*
	* @public
	*/
	showDirect: function() {
		var anim = this.animate;
		if (anim) {
			this.set('animate', false);
		}
		this.show();
		if (anim) {
			// getComputedStyleValue forces the browser to update the style rules before
			// proceeding. Otherwise the removal and addition of the "animate" class happens in
			// one rendering-pass, which will have no visual difference.
			this.getComputedStyleValue('display');
			this.set('animate', anim);
		}
	},

	/**
	* Skips animation and jumps to the final hidden state.
	*
	* @public
	*/
	hideDirect: function() {
		var anim = this.animate;
		if (anim) {
			this.set('animate', false);
		}
		this.hide();
		if (anim) {
			this.set('animate', anim);
		}
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
			scrim.addRemoveClass(this.scrimClassName, scrim.showing);
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
			return Scrim.scrimTransparent.make();
		}
		return Scrim.scrim.make();
	},

	/**
	* @private
	*/

	/**
	* Removes focused style from close button and hides the popup.
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
	* Attempts to respot the activating control when the popup is hidden.
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
			Spotlight.spot(a);
			if (a instanceof Button) {
				a.removeClass('pressed');
			}
		} else {
			// As a failsafe, attempt to spot the container if no activator is present
			Spotlight.spot(Spotlight.getFirstChild(this.container));
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
	destroy: function() {
		this.showHideScrim(false);
		Popup.prototype.destroy.apply(this, arguments);
	}
});
