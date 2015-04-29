require('moonstone');

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Spotlight = require('spotlight');

var
	ContextualPopupButton = require('../ContextualPopupButton');

/**
* {@link moon.ContextualPopupDecorator} is a control that loosely couples a
* {@link moon.ContextualPopup} with an activating control, which may be a button
* or any other control that fires an [onActivate]{@link enyo.Control#onActivate}
* event. The decorator surrounds both the activating control and the contextual popup.
*
* When the control is activated, the popup shows itself in the correct position
* relative to the activator.
*
* ```
*		{kind: 'moon.ContextualPopupDecorator', components: [
*			{content: 'Show Popup'},
*			{kind: 'moon.ContextualPopup',
*				components: [
*					{content:'Sample component in popup'}
*				]
*			}
*		]}
* ```
*
* @class moon.ContextualPopupDecorator
* @extends enyo.Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends moon.ContextualPopupDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.ContextualPopupDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	defaultKind: ContextualPopupButton,

	/**
	* Selection on iOS prevents tap events, so avoid.
	*
	* @private
	*/
	classes: 'moon-contextual-popup-decorator',

	/**
	* @private
	*/
	handlers: {
		onActivate: 'activated',
		onShow: 'popupShown',
		onHide: 'popupHidden',
		onRequestSpot: 'requestSpot'
	},

	/**
	* @fires enyo.Control#onActivate
	* @private
	*/
	activated: function (inSender, inEvent) {
		// Don't process activate events that came from inside this decorator
		if (inEvent.sentFromPopup && inEvent.sentFromPopup.isDescendantOf(this)) {
			return;
		}

		if (inEvent.originator.active) {
			this.activator = inEvent.originator;
			// if this ContextualPopup is already activated
			if (this.popupActivated) {
				inEvent.originator.active = false;
				this.popupActivated = false;
			} else {
				this.activator.addClass('active');
				this.requestShowPopup();
			}
		}
	},

	/**
	* Handles `onShow` event.  Since the popup is a 'client control' of the decorator,
	* we should provide a connector between them.
	*
	* @param {Object} inSender - The component that most recently propagated the `onShow` event.
	* @param {Object} inEvent - An object containing event information.
	* @private
	*/
	popupShown: function (inSender, inEvent) {
		if (this.popup === undefined) {
			this.popup = inEvent.originator;
		}
	},

	/**
	* Handles `onHide` event. If you tap outside of the popup, it will close.
	*
	* @private
	*/
	popupHidden: function () {
		if (this.activator) {
			this.popupActivated = this.popup.popupActivated;
			this.activator.active = false;
			this.activator.removeClass('active');
			this.activator.removeClass('pressed');
		}
	},

	/**
	* Event waterfalls down.
	* @fires moon.ContextualPopup#onRequestShowPopup
	* @private
	*/
	requestShowPopup: function () {
		this.waterfallDown('onRequestShowPopup', {activator: this.activator});
	},

	/**
	* Event waterfalls down.
	* @fires moon.ContextualPopup#onRequestHidePopup
	* @private
	*/
	requestHidePopup: function () {
		this.waterfallDown('onRequestHidePopup');
	},

	/**
	* When back key is pressed, return spotlight focus to popup button
	*
	* @private
	*/
	requestSpot: function (inSender, inEvent) {
		Spotlight.spot(this);
		return true;
	}
});