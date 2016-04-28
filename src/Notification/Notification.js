require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Notification~Notification} kind.
* @module moonstone/Notification
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	dispatcher = require('enyo/dispatcher'),
	EnyoHistory = require('enyo/History'),
	Popup = require('enyo/Popup'),
	ShowingTransitionSupport = require('enyo/ShowingTransitionSupport');

var
	Spotlight = require('spotlight');

var
	Button = require('../Button'),
	BodyText = require('../BodyText'),
	HistorySupport = require('../HistorySupport');

/**
* {@link module:moonstone/Notification~Notification} is a toast-like minimal popup that comes up
* from the bottom of the screen. It requires a button to be provided and present to close it.
*
* @class Notification
* @extends module:enyo/Popup~Popup
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/Notification~Notification.prototype */ {

	/**
	* @private
	*/
	name: 'moon.Notification',

	/**
	* @private
	*/
	kind: Popup,

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
	floating: true,

	/**
	* @private
	*/
	spotlight: 'container',

	/**
	* @private
	*/
	modal: true,

	/**
	* @private
	*/
	spotlightRememberFocus: false,

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
	handlers: {
		onRequestScrollIntoView   : '_preventEventBubble'
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
		* The message that will be displayed in the notification's text area.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		content: '',

		/**
		* The duration, in miliseconds, that the notification takes to animate on and off screen.
		* Setting to zero (0) forces the transition on/off screen to be instant. However, if your
		* desire is to have immediate transitions, it's more efficient to simply toggle
		* [animate]{@link module:moonstone/Notification~Notification#animate}.
		*
		* @type {Number}
		* @default 400
		* @public
		*/
		showHideDuration: 400,

		/**
		* If `true`, {@glossary Spotlight} (focus) cannot leave the area of the notification unless
		* the notification is explicitly closed; if `false`, spotlight may be moved anywhere within
		* the viewport.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		spotlightModal: true
	},

	/**
	* @private
	*/
	components: [
		{name: 'message', kind: BodyText},
		{name: 'client', kind: Control, classes: 'enyo-fill client moon-hspacing'}
	],

	/**
	* @private
	*/
	bindings: [
		{from: 'content', to: '$.message.content'},
		{from: 'allowHtml', to: '$.message.allowHtml'}
	],

	/**
	* @private
	*/
	create: function () {
		Popup.prototype.create.apply(this, arguments);
		this.animateChanged();
	},

	/**
	* @private
	*/
	render: function () {
		this._initialized = true;
		Popup.prototype.render.apply(this, arguments);
	},

	/**
	* @private
	*/
	showHideDurationChanged: function () {
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
	animateChanged: function () {
		this.showHideDurationChanged();
		this.addRemoveClass('animate', this.animate);
		this.showHideDurationChanged();
	},

	/**
	* @private
	*/
	showingTransitioningChanged: function () {
		if (this.showingTransitioning) {
			// if we are currently animating the hide transition, release
			// the events captured when popup was initially shown
			if (this.captureEvents) {
				this.release();
			}
		}

		if (!this.showing) {
			Spotlight.unspot();
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
				Spotlight.setPointerMode(false);
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

		if (this._initialized && this.allowBackKey && !EnyoHistory.isProcessing()) {
			EnyoHistory.drop();
		}
	},

	/**
	* Skips animation and jumps to the final shown state.
	*
	* @public
	*/
	showDirect: function () {
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
	hideDirect: function () {
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
	respotActivator: function () {
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
	_preventEventBubble: function (sender, ev) {
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
