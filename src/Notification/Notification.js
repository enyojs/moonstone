require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/Notification~Notification} kind.
* @module moonstone/Notification
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control'),
	dispatcher = require('enyo/dispatcher'),
	dom = require('enyo/dom'),
	EnyoHistory = require('enyo/History'),
	Popup = require('enyo/Popup'),
	ShowingTransitionSupport = require('enyo/ShowingTransitionSupport');

var
	Spotlight = require('spotlight');

var
	Button = require('../Button'),
	BodyText = require('../BodyText'),
	HistorySupport = require('../HistorySupport');

var
	options = require('enyo/options');

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
	activator: null,

	/**
	* @private
	*/
	showingMethod: 'beforeShow',

	/**
	* @private
	*/
	shownMethod: 'afterShow',

	/**
	* @private
	*/
	hidingMethod: 'beforeHide',

	/**
	* @private
	*/
	hiddenMethod: 'afterHide',

	/**
	* @private
	*/
	handlers: {
		onRequestScrollIntoView   : '_preventEventBubble',
		onSpotlightSelect         : 'handleSpotlightSelect',
		onSpotlightContainerEnter : 'onEnter'
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
		animate: false,

		/**
		*
		* When `true`, HTML tags are allowed in the control's content.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		allowHtml: true,

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
		spotlightModal: true,

		/**
		* If `true`, use wide popup to secure enough space for 4 large buttons.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		wide: false,

		/**
		* If `true`, round numbers of absolute bounds to render text flawlessly.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		autoPositionAdjustment: true
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
		this.wideChanged();
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
		this.applyStyle('-webkit-transition', '-webkit-transform ' + dur + 'ms cubic-bezier(0,1.5,.75,1)');
		this.applyStyle('-moz-transition', '-moz-transform ' + dur + 'ms cubic-bezier(0,1.5,.75,1)');
		this.applyStyle('transition', 'transform ' + dur + 'ms cubic-bezier(0,1.5,.75,1)');
	},

	/**
	* @private
	*/
	animateChanged: function () {
		this.addRemoveClass('animate', this.animate);
		this.showHideDurationChanged();
	},

	/**
	* @private
	*/
	beforeShow: function (sender, ev) {
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
	refineAbsoluteBounds: function () {
		var b = this.getAbsoluteBounds(),
			l = b ? b.left : 0,
			t = b ? b.top : 0,
			transforms = {};

		if (l % 1 !== 0 || t % 1 !== 0) {
			transforms.translateX = Math.round(l) + 'px';
			transforms.translateY = Math.round(t) + 'px';
			dom.transform(this, transforms);
		}
	},

	/**
	* @private
	*/
	afterShow: function (sender, ev) {
		if (this.autoPositionAdjustment) {
			this.refineAbsoluteBounds();
		}
	},

	/**
	* @private
	*/
	beforeHide: function (sender, ev) {
		if (this._initialized) {
			this.respotActivator();

			if (this.allowBackKey && !EnyoHistory.isProcessing()) {
				EnyoHistory.drop();
			}
		}
	},

	/**
	* @private
	*/
	afterHide: function (sender, ev) {
		// Make all contained containers forget last focused child
		this.waterfall('onRequestSetLastFocusedChild', {
			type: 'onRequestSetLastFocusedChild',
			originator: this,
			last: null
		});
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
	wideChanged: function () {
		this.addRemoveClass('wide', this.wide);
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
			this.updateAriaRole();
		}}
	],

	/**
	* @private
	*/
	onEnter: function (oSender, oEvent) {
		if (options.accessibility && oEvent.originator == this) {
			this.updateAriaRole();
		}
	},

	/**
	* @private
	*/
	updateAriaRole: function () {
		this.setAriaAttribute('role', this.accessibilityReadAll && this.showing ? 'alert' : this.accessibilityRole);
	}
});
