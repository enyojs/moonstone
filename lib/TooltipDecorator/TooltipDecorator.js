require('moonstone');

/**
* Contains the declaration for the {@link module:moonstone/TooltipDecorator~TooltipDecorator} kind.
* @module moonstone/TooltipDecorator
*/

var
	kind = require('enyo/kind'),
	Control = require('enyo/Control');

var
	Spotlight = require('spotlight');

var
	Button = require('../Button');

/**
* Bubble this event from a contained [control]{@link module:enyo/Control~Control} to mute tooltips. No data
* needs be passed with this event.
*
* @event moon.TooltipDecorator#onRequestMuteTooltip
* @type {Object}
* @public
*/

/**
* Bubble this event from a contained [control]{@link module:enyo/Control~Control} to unmute tooltips. No data
* needs be passed with this event.
*
* @event moon.TooltipDecorator#onRequestUnmuteTooltip
* @type {Object}
* @public
*/

/**
* {@link module:moonstone/TooltipDecorator~TooltipDecorator} is a control that activates a {@link module:moonstone/Tooltip~Tooltip}. It
* surrounds a control such as a button and displays the tooltip when the control generates
* an `onenter` event:
*
* ```
* {kind: 'moon.TooltipDecorator', components: [
*	{kind: 'moon.Button', content: 'Tooltip'},
*	{kind: 'moon.Tooltip', content: 'I am a tooltip for a button.'}
* ]}
* ```
*
* Here is an example with a {@link module:moonstone/Input~Input} control and a decorator around the input:
*
* ```
* {kind: 'moon.TooltipDecorator', components: [
*	{kind: 'moon.InputDecorator', components: [
*		{kind: 'moon.Input', placeholder: 'Just an input...'}
*	]},
*	{kind: 'moon.Tooltip', content: 'I am just a tooltip for an input.'}
* ]}
* ```
*
* Automatic hiding and showing of tooltips may be disabled by calling
* [mute()]{@link module:moonstone/TooltipDecorator~TooltipDecorator#mute} or by bubbling the
* [onRequestMuteTooltip]{@link module:moonstone/TooltipDecorator~TooltipDecorator#onRequestMuteTooltip} event;
* it may be re-enabled by calling [unmute()]{@link module:moonstone/TooltipDecorator~TooltipDecorator#unmute}
* or by bubbling the
* [onRequestUnmuteTooltip]{@link module:moonstone/TooltipDecorator~TooltipDecorator#onRequestUnmuteTooltip} event.
*
* @class TooltipDecorator
* @extends module:enyo/Control~Control
* @ui
* @public
*/
module.exports = kind(
	/** @lends module:moonstone/TooltipDecorator~TooltipDecorator.prototype */ {

	/**
	* @private
	*/
	name: 'moon.TooltipDecorator',

	/**
	* @private
	*/
	kind: Control,

	/**
	* @private
	*/
	defaultKind: Button,

	/**
	* @private
	*/
	classes: 'moon-contextual-popup-decorator',

	/**
	* @private
	*/
	handlers: {
		onenter: 'requestShowTooltip',
		onleave: 'requestHideTooltip',
		onSpotlightFocused: 'requestShowTooltip',
		onSpotlightBlur: 'requestHideTooltip',
		onRequestMuteTooltip: 'mute',
		onRequestUnmuteTooltip: 'unmute'
	},

	/**
	* @private
	* @lends module:moonstone/TooltipDecorator~TooltipDecorator.prototype
	*/
	published: {
		/**
		* Boolean indicating whether tooltips are automatically shown when the activator is
		* hovered over.
		*
		* @type {Boolean}
		* @default true
		* @public
		*/
		autoShow: true
	},

	/**
	* Disables automatic tooltip showing and hiding.
	*
	* @public
	*/
	mute: function () {
		this.setAutoShow(false);
	},

	/**
	* Re-enables automatic tooltip showing and hiding after being muted.
	*
	* @public
	*/
	unmute: function () {
		this.setAutoShow(true);
	},

	/**
	* @private
	*/
	autoShowChanged: function () {
		if (!this.autoShow) {
			this.requestHideTooltip();
		}
	},

	/**
	* @private
	*/
	tap: function () {
		this.requestHideTooltip();
	},

	/**
	* @private
	*/
	requestShowTooltip: function (inSender, inEvent) {
		if (this.autoShow && !Spotlight.isFrozen()) {
			if (inEvent.type == 'onSpotlightFocused' || Spotlight.getPointerMode()) {
				this.waterfallDown('onRequestShowTooltip', {originator: inSender}, this);
			}
		}
	},

	/**
	* @private
	*/
	requestHideTooltip: function () {
		this.waterfallDown('onRequestHideTooltip');
	},

	/**
	* Cancel any pending tooltip showing if the decorator or one of its ancestors is hidden
	*
	* @private
	*/
	showingChangedHandler: function (sender, event) {
		Control.prototype.showingChangedHandler.apply(this, arguments);
		if (!event.showing) {
			this.requestHideTooltip();
		}
	}
});
