require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Popup~Popup} kind.
* @module moonstone/Popup
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	dispatcher = require('enyo/dispatcher'),
	EnyoHistory = require('enyo/History'),
	ShowingTransitionSupport = require('enyo/ShowingTransitionSupport');

var
	Spotlight = require('spotlight');

var
	Button = require('../Button'),
	HistorySupport = require('../HistorySupport');

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
	name: 'moon.Notification',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	mixins: [HistorySupport, ShowingTransitionSupport],

	/**
	* @private
	*/
	showing: false,

	/**
	* @private
	*/
	classes: 'moon moon-neutral enyo-unselectable moon-notification',

	/**
	* @private
	*/
	// floating: true,

	/**
	* @private
	*/
	spotlight: 'container',

	/**
	* @private
	*/
	spotlightRememberFocus: false,

	/**
	* @private
	*/
	allowDefault: true,

	/**
	* @private
	*/
	handlers: {
		onRequestScrollIntoView   : '_preventEventBubble',
		// ontransitionend           : 'animationEnd',
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
		* When `true`, popups will animate on/off screen.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		animate: true,

		/**
		* When `true`, popups will animate on/off screen.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		showHideDuration: 400
	},

	/**
	* @private
	*/
	components: [
		{name: 'container', kind: Control, classes: 'container', components: [
			{name: 'textArea', kind: Control, classes: 'text-area'}
		]}
	],

	bindings: [
		{from: 'content', to: '$.textArea.content'},
		{from: 'allowHtml', to: '$.textArea.allowHtml'}
	],

	/**
	* @private
	*/
	activator: null,

	/**
	* @private
	*/
	shownMethod: 'shown',

	/**
	* @private
	*/
	hiddenMethod: 'hidden',

	/**
	* @private
	*/
	initComponents: function () {
		Control.prototype.initComponents.apply(this, arguments);

		// UX & GUI requirement
		// If number of buttons is less than 3, placing buttons to right side with bottom aligned.
		// else placing buttons to bottom row with right side aligned. (to minimize size of popup)
		//
		// In my opinion, there are four options..
		//
		// A. Support this as framework feature
		// B. Leave it blank and app developers use it as free format
		// C. Support this as framework feature but provides only two types. (e.g. buttonLocation: 'right', 'bottom')
		// D. Implement another UX that placing buttons to bottom right and be mixed with text. (not sure it's feasible)
		// - example
		// +------------------------------------------------------------------------+
		// | Very long text........................................................ |
		// | ................................................ [BUTTON A] [BUTTON B] |
		// +------------------------------------------------------------------------+
		var bcs = this.buttonComponents;

		if (bcs) {
			// make array of wrapped buttons..
			var wbs = [],
				c = this.$.container,
				o = this.owner;

			if (bcs.length < 3) {
				c.addClass('less-buttons');

				for (var i=0; i<bcs.length; i++) {
					wbs.push({classes: 'button-wrapper', components: [bcs[i]], owner: o});
				}
			} else {
				wbs.push({classes: 'button-wrapper', components: bcs, owner: o});
			}

			c.createComponents(wbs);
		}
	},

	/**
	* @private
	*/
	create: function () {
		Control.prototype.create.apply(this, arguments);
		this.animateChanged();
	},

	/**
	* Renders {@link module:moonstone/Control~Control}, extending {@link module:enyo/Control~Control}
	*
	* @private
	*/
	render: function() {
		this._initialized = true;
		Control.prototype.render.apply(this, arguments);
	},

	/**
	* @private
	*/
	showHideDurationChanged: function() {
		var dur = (this.animate && this.showHideDuration) ? this.showHideDuration : 0;
		this.set('showingDuration', dur);
		this.set('hidingDuration', dur);
		this.applyStyle('-webkit-transition-duration', dur + 'ms');
		this.applyStyle('-moz-transition-duration', dur + 'ms');
		this.applyStyle('transition-duration', dur + 'ms');
	},

	/**
	* @private
	*/
	animateChanged: function() {
		this.showHideDurationChanged();
		this.addRemoveClass('animate', this.animate);
		this.showHideDurationChanged();
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
			Control.prototype.capturedTap.apply(this, arguments);
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

	showingTransitioningChanged: function () {
		if (this.showingTransitioning) {
			// if we are currently animating the hide transition, release
			// the events captured when popup was initially shown
			if (this.captureEvents) {
				this.release();
			}

			if (!this.showing) {
				Spotlight.unspot();
			}
		}
	},

	/**
	* @private
	*/
	shown: function (sender, ev) {
		this.activator = Spotlight.getCurrent();

		var current = this.activator;
		if (!current || !current.isDescendantOf(this)) {
			if (Spotlight.isSpottable(this)) {
				Spotlight.spot(this);
			}
			// If we're not spottable, just unspot whatever was previously spotted
			else {
				Spotlight.unspot();
			}
		}

		if (this.allowBackKey) {
			this.pushBackHistory();
		}
	},

	/**
	* @private
	*/
	hidden: function (sender, ev) {
		this.respotActivator();

		// debugger;
		if (this._initialized && this.allowBackKey && !EnyoHistory.isProcessing()) {
			EnyoHistory.drop();
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
			this.getComputedStyleValue('display');
			this.set('animate', anim);
		}
	},

	/**
	* @private
	*/
	release: function () {
		dispatcher.release(this);
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
	* When `true`, the contents of the popup will be read when shown.
	*
	* @default true
	* @type {Boolean}
	* @public
	*/
	accessibilityReadAll: true,

	/**
	* @private
	*/
	accessibilityLive: 'off',

	/**
	* @private
	*/
	ariaObservers: [
		{path: ['accessibilityReadAll', 'accessibilityRole', 'showing'], method: function () {
			this.startJob('alert', function () {
				this.setAriaAttribute('role', this.accessibilityReadAll && this.showing ? 'alert' : this.accessibilityRole);
			}, 100);
		}}
	]
});
