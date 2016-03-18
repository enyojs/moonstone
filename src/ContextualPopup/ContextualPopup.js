require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/ContextualPopup~ContextualPopup} kind.
* @module moonstone/ContextualPopup
*/

var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	ri = require('enyo/resolution'),
	util = require('enyo/utils'),
	Control = require('enyo/Control'),
	EnyoHistory = require('enyo/History'),
	Popup = require('enyo/Popup');

var
	ContextualLayout = require('layout/ContextualLayout');

var
	Spotlight = require('spotlight');

var
	$L = require('../i18n'),
	IconButton = require('../IconButton'),
	Scrim = require('moonstone/Scrim'),
	HistorySupport = require('../HistorySupport');

/**
* Fires when the contextual popup is to be shown.
*
* @event module:moonstone/ContextualPopup~ContextualPopup#onRequestShowPopup
* @type {Object}
* @property {Object} activator - A reference to the activating object.
* @public
*/

/**
* Fires when the contextual popup is to be hidden. No additional data is included
* with this event.
*
* @event module:moonstone/ContextualPopup~ContextualPopup#onRequestHidePopup
* @type {Object}
* @public
*/

/**
* Fires when the contextual popup is activated. Extends {@link module:enyo/Popup~Popup#onActivate}.
*
* @event module:moonstone/ContextualPopup~ContextualPopup#onActivate
* @type {Object}
* @property {Object} sentFromPopup - A reference to the popup.
* @public
*/

/**
* {@link module:moonstone/ContextualPopup~ContextualPopup} is a popup window control with Moonstone visual
* styling applied. It extends {@link module:enyo/Popup~Popup} and is designed to be used with
* {@link module:moonstone/ContextualPopupDecorator~ContextualPopupDecorator}.
*
* @class ContextualPopup
* @extends module:enyo/Popup~Popup
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/ContextualPopup~ContextualPopup.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ContextualPopup',

	/**
	* @private
	*/
	kind: Popup,

	/**
	* @private
	*/
	mixins: [HistorySupport],

	/**
	* @private
	*/
	layoutKind: ContextualLayout,

	/**
	* @private
	*/
	classes: 'moon-body-text moon-contextual-popup moon-neutral',

	/**
	* @private
	*/
	events: {
		onRequestSpot: ''
	},

	/**
	* @private
	*/
	handlers: {
		onRequestShowPopup: 'requestShow',
		onRequestHidePopup: 'requestHide',
		onActivate: 'decorateActivateEvent',
		onRequestScrollIntoView: '_preventEventBubble',
		onSpotlightContainerLeave: 'onLeave'
	},

	/**
	* @private
	*/
	eventsToCapture: {
		onSpotlightKeyDown: 'capturedKeyDown',
		onSpotlightFocus: 'capturedFocus'
	},

	/**
	* @private
	*/
	modal: true,

	/**
	* @private
	* @lends module:moonstone/ContextualPopup~ContextualPopup.prototype
	*/
	published: {

		/**
		* If `true`, focus cannot leave the constraints of the popup unless the
		* popup is explicitly closed. This property's value is copied to
		* [modal]{@link module:enyo/Popup~Popup#modal} at initialization time.
		* Additionally, these two properties are synced whenever one of the following properties changes:
		* [spotlightModal]{@link module:moonstone/ContextualPopup~ContextualPopup#spotlightModal},
		* [modal]{@link module:enyo/Popup~Popup#modal},
		* [modal]{@link module:enyo/Popup~Popup#scrim},
		* [modal]{@link module:enyo/Popup~Popup#scrimWhenModal},
		* [modal]{@link module:enyo/Popup~Popup#floating}.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		spotlightModal: false,

		/**
		* When `true`, the close button is shown; when `false`, it is hidden.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		showCloseButton: false
	},

	/**
	* @private
	*/
	spotlight: 'container',

	/**
	* @private
	*/
	floating: true,

	/**
	* Determines whether a scrim will appear when the popup is modal.
	* Note that modal scrims are transparent, so you won't see them.
	*
	* @private
	*/
	scrimWhenModal: true,

	// Layout parameters

	/**
	* Vertical flush layout margin.
	*
	* @private
	*/
	vertFlushMargin:0,

	/**
	* Horizontal flush layout margin.
	*
	* @private
	*/
	horizFlushMargin:0,

	/**
	* Popups wider than this value are considered wide (for layout purposes).
	*
	* @private
	*/
	widePopup: ri.scale(210),

	/**
	* Popups longer than this value are considered long (for layout purposes).
	*
	* @private
	*/
	longPopup: ri.scale(210),

	/**
	* Do not allow horizontal flush popups past spec'd amount of buffer space on left/right
	* screen edge.
	*
	* @private
	*/
	horizBuffer: ri.scale(15),

	/**
	* @private
	*/
	activator: null,

	/**
	* @private
	*/
	observers: [
		{method: 'updateScrim', path: [ 'modal', 'spotlightModal', 'floating', 'scrim', 'scrimWhenModal' ]}
	],

	/**
	* @private
	*/
	tools: [
		{name: 'client', kind: Control, classes: 'moon-contextual-popup-client'},
		{name: 'closeButton', kind: IconButton, icon: 'closex', classes: 'moon-popup-close', ontap: 'closePopup', backgroundOpacity: 'transparent', accessibilityLabel: $L('Close'), tabIndex: -1, spotlight: false}
	],

	/**
	* Creates chrome components.
	*
	* @private
	*/
	initComponents: function () {
		this.createChrome(this.tools);
		Popup.prototype.initComponents.apply(this, arguments);
		this.modal = this.spotlightModal;
	},

	/**
	* @private
	*/
	create: function () {
		Popup.prototype.create.apply(this, arguments);
		this.showCloseButtonChanged();
	},

	/**
	* Renders the contextual popup.
	*
	* @private
	*/
	render: function () {
		this.allowHtmlChanged();
		this.contentChanged();
		Popup.prototype.render.apply(this, arguments);
	},

	/**
	FixMe: overriding the control's default hide method to support the existing sequential tapping
	and the dependent decorator code inorder to handle some special cases.
	*/
	hide: function(inSender, e) {

		if (this.tapCaptured) {
			this.tapCaptured = false;
			this.popupActivated = true;
		} else {
			this.popupActivated = false;
		}
		Popup.prototype.hide.apply(this, arguments);

	},

	/**
	* Performs control-specific tasks before/after showing {@link module:moonstone/ContextualPopup~ContextualPopup}.
	*
	* @private
	*/
	requestShow: function (inSender, inEvent) {
		var n = inEvent.activator.hasNode();
		this.activator = inEvent.activator;
		if (n) {
			this.activatorOffset = this.getPageOffset(n);
		}
		this.show();
		if (Spotlight.isSpottable(this)) {
			Spotlight.spot(this);
		}
		return true;
	},

	/**
	* @fires module:enyo/Popup~Popup#onActivate
	* @private
	*/
	decorateActivateEvent: function (inSender, inEvent) {
		inEvent.sentFromPopup = this;
	},

	/**
	* @private
	*/
	getPageOffset: function (inNode) {
		// getBoundingClientRect returns top/left values which are relative to the viewport and
		// not absolute
		var r = inNode.getBoundingClientRect(),
			pageYOffset = window.pageYOffset,
			pageXOffset = window.pageXOffset,
			rHeight = r.height,
			rWidth = r.width;

		return {top: r.top + pageYOffset, left: r.left + pageXOffset, height: rHeight, width: rWidth, bottom: r.top + pageYOffset + rHeight, right: r.left + pageXOffset + rWidth};
	},

	/**
	* @private
	*/
	resetDirection: function () {
		this.removeClass('right');
		this.removeClass('left');
		this.removeClass('high');
		this.removeClass('low');
		this.removeClass('below');
		this.removeClass('above');
	},

	/**
	* Alters the direction of the popup.
	*
	* @private
	*/
	alterDirection: function () {
		if (this.showing) {
			var clientRect = this.getBoundingRect(this.node);
			var viewPortHeight = dom.getWindowHeight();
			var viewPortWidth = dom.getWindowWidth();
			var offsetHeight = (clientRect.height - this.activatorOffset.height) / 2;
			var offsetWidth = (clientRect.width - this.activatorOffset.width) / 2;
			var popupMargin = 20;

			var bounds = {top: null, left: null};

			if(this.direction === 'left') {
				if(clientRect.width + popupMargin < this.activatorOffset.left) {
					this.resetDirection();
					this.addClass('right');

					if(this.activatorOffset.top < offsetHeight) {
						this.addClass('high');
						bounds.top = this.activatorOffset.top;
					} else if(viewPortHeight - this.activatorOffset.bottom < offsetHeight) {
						this.addClass('low');
						bounds.top = this.activatorOffset.bottom - clientRect.height;
					} else {
						bounds.top = this.activatorOffset.top - offsetHeight;
					}

					bounds.left = this.activatorOffset.left - clientRect.width;
				}
			} else if(this.direction === 'right') {
				if(viewPortWidth > this.activatorOffset.right + clientRect.width + popupMargin) {
					this.resetDirection();
					this.addClass('left');

					if(this.activatorOffset.top < offsetHeight) {
						this.addClass('high');
						bounds.top = this.activatorOffset.top;
					} else if(viewPortHeight - this.activatorOffset.bottom < offsetHeight) {
						this.addClass('low');
						bounds.top = this.activatorOffset.bottom - clientRect.height;
					} else {
						bounds.top = this.activatorOffset.top - offsetHeight;
					}

					bounds.left = this.activatorOffset.right;
				}
			} else if(this.direction === 'top') {
				if(clientRect.height + popupMargin < this.activatorOffset.top) {
					this.resetDirection();
					this.addClass('above');

					if(this.activatorOffset.left < offsetWidth) {
						this.addClass('right');
						bounds.left = this.activatorOffset.left;
					} else if(viewPortWidth - this.activatorOffset.right < offsetWidth) {
						this.addClass('left');
						bounds.left = this.activatorOffset.right - clientRect.width;
					} else {
						bounds.left = this.activatorOffset.left - offsetWidth;
					}

					bounds.top = this.activatorOffset.top - clientRect.height;
				}
			} else if(this.direction === 'bottom') {
				if(viewPortHeight > this.activatorOffset.bottom + clientRect.height + popupMargin) {
					this.resetDirection();
					this.addClass('below');

					if(this.activatorOffset.left < offsetWidth) {
						this.addClass('right');
						bounds.left = this.activatorOffset.left;
					} else if(viewPortWidth - this.activatorOffset.right < offsetWidth) {
						this.addClass('left');
						bounds.left = this.activatorOffset.right - clientRect.width;
					} else {
						bounds.left = this.activatorOffset.left - offsetWidth;
					}

					bounds.top = this.activatorOffset.bottom;
				}
			}

			this.setBounds(bounds);
		}
	},

	/**
	* @private
	*/
	getBoundingRect: function (node) {
		// getBoundingClientRect returns top/left values which are relative to the viewport and not absolute
		var o = node.getBoundingClientRect();
		if (!o.width || !o.height) {
			return {
				left: o.left,
				right: o.right,
				top: o.top,
				bottom: o.bottom,
				width: o.right - o.left,
				height: o.bottom - o.top
			};
		}
		return o;
	},

	/**
	* Dismisses popup if Escape keypress is detected.
	*
	* @private
	*/
	keydown: function (inSender, inEvent) {
		if (this.showing && this.autoDismiss && inEvent.keyCode == 27 /* escape */) {
			this.hide();
			Spotlight.spot(this.activator);
		}
	},

	/**
	* @private
	*/
	closePopup: function (inSender, inEvent) {
		this.$.closeButton.removeClass('pressed');
		this.hide();
		Spotlight.spot(this.activator);
		return true;
	},

	/**
	* @private
	*/
	contentChanged: function () {
		this.$.client.set('content', this.content);
	},

	/**
	* @private
	*/
	allowHtmlChanged: function () {
		this.$.client.set('allowHtml', this.allowHtml);
	},

	/**
	* Called when [showCloseButton]{@link module:moonstone/ContextualPopup~ContextualPopup#showCloseButton} changes.
	*
	* @private
	*/
	showCloseButtonChanged: function () {
		this.$.closeButton.set('showing', this.showCloseButton);
		this.$.closeButton.spotlight = this.showCloseButton;
		this.addRemoveClass('reserve-close', this.showCloseButton);
	},

	/**
	* @private
	*/
	capturedKeyDown: function (inSender, inEvent) {
		if (inEvent.keyCode == 13) {
			this.downEvent = inEvent;
		}
		return this.modal && this.spotlightModal;
	},

	/**
	* @private
	*/
	capturedFocus: function(inSender, inEvent) {
		if(this.modal && this.spotlightModal) {
			Spotlight.spot(this);
			return true;
		}
	},

	/**
	* @private
	*/
	capturedTap: function (inSender, inEvent) {
		// If same activator tapped sequentially, the state of the popup is remembered.
		if (this.downEvent && this.downEvent.dispatchTarget.isDescendantOf(this.activator)) {
			this.popupActivated = true;
			this.tapCaptured = true;
		}
		Popup.prototype.capturedTap.apply(this, arguments);
	},

	/**
	* @private
	*/
	onLeave: function (oSender, oEvent) {
		if (oEvent.originator == this && !Spotlight.getPointerMode()) {
			this.popupActivated = false;
			this.hide();
			Spotlight.spot(this.activator);
		}
	},

	/**
	* @private
	*/
	_preventEventBubble: function (inSender, inEvent) {
		return true;
	},

	/**
	* @private
	*/
	updateScrim: function (old, value, source) {
		if (this._updateScrimMutex) return;
		this._updateScrimMutex = true;

		// We sync modal and spotlightModal here because binding doesn't
		// guarantee sequence when it is used with observers.
		if (source == 'modal') this.set('spotlightModal', this.modal);
		if (source == 'spotlightModal') this.set('modal', this.spotlightModal);
		this.showHideScrim(this.showing);

		this._updateScrimMutex = false;
	},

	/**
	* @private
	*/
	showHideScrim: function (show) {
		var scrim = this.getScrim();

		if (this._scrim && scrim != this._scrim) {
			// hide if there was different kind of scrim
			this._scrim.hideAtZIndex(this._scrimZ);
			if (this.scrimClassName) this._scrim.removeClass(this.scrimClassName);
		}

		if (show && this.floating && (this.scrim || (this.modal && this.scrimWhenModal))) {
			// move scrim to just under the popup to obscure rest of screen
			var i = this.getScrimZIndex();
			this._scrimZ = i;
			scrim.showAtZIndex(i);
		} else {
			scrim.hideAtZIndex(this._scrimZ);
		}
		util.call(scrim, 'addRemoveClass', [this.scrimClassName, scrim.showing]);
		this._scrim = scrim;
	},

	/**
	* @private
	*/
	getScrimZIndex: function () {
		// Position scrim directly below popup
		return this.findZIndex()-1;
	},

	/**
	* @private
	*/
	getScrim: function () {
		// show a transparent scrim for modal popups if
		// {@link module:moonstone/ContextualPopup~ContextualPopup#scrimWhenModal} is `true`, else show a
		// regular scrim.
		if (this.modal && this.scrimWhenModal && !this.scrim) {
			return Scrim.scrimTransparent.make();
		}
		return Scrim.scrim.make();
	},

	/**
	* @private
	*/
	showingChanged: function () {
		Popup.prototype.showingChanged.apply(this, arguments);
		this.alterDirection();

		if (this.allowBackKey) {
			if (this.showing) {
				this.pushBackHistory();
			} else if(!this.showing && !EnyoHistory.isProcessing()) {
				EnyoHistory.drop();
			}
		}
	},

	/**
	* @private
	*/
	backKeyHandler: function() {
		if (this.showing) {
			this.hide();
		}

		if (this.spotlight && !this.spotlightDisabled) {
			this.doRequestSpot();
		}
		return true;
	},

	/**
	* @private
	*/
	directionChanged: function () {
		this.alterDirection();
	},

	// Accessibility

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
