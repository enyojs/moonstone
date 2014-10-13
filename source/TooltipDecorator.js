(function (enyo, scope) {
	/**
	* Bubble this event from a contained [control]{@link enyo.Control} to mute tooltips. No data
	* needs be passed with this event.
	*
	* @event moon.TooltipDecorator#onRequestMuteTooltip
	* @type {Object}
	* @public
	*/

	/**
	* Bubble this event from a contained [control]{@link enyo.Control} to unmute tooltips. No data
	* needs be passed with this event.
	*
	* @event moon.TooltipDecorator#onRequestUnmuteTooltip
	* @type {Object}
	* @public
	*/

	/**
	* {@link moon.TooltipDecorator} is a control that activates a {@link moon.Tooltip}. It
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
	* Here is an example with a {@link moon.Input} control and a decorator around the input:
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
	* [mute()]{@link moon.TooltipDecorator#mute} or by bubbling the
	* [onRequestMuteTooltip]{@link moon.TooltipDecorator#event:onRequestMuteTooltip} event;
	* it may be re-enabled by calling [unmute()]{@link moon.TooltipDecorator#unmute}
	* or by bubbling the
	* [onRequestUnmuteTooltip]{@link moon.TooltipDecorator#event:onRequestUnmuteTooltip} event.
	*
	* @class moon.TooltipDecorator
	* @extends enyo.Control
	* @ui
	* @public
	*/
	enyo.kind(
		/** @lends  moon.TooltipDecorator.prototype */ {

		/**
		* @private
		*/
		name: 'moon.TooltipDecorator',

		/**
		* @private
		*/
		defaultKind: 'moon.Button',

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
		* @lends moon.TooltipDecorator.prototype
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
			if (this.autoShow && !enyo.Spotlight.isFrozen()) {
				if (inEvent.type == 'onSpotlightFocused' || enyo.Spotlight.getPointerMode()) {
					this.waterfallDown('onRequestShowTooltip', {originator: inSender}, this);
				}
			}
		},

		/**
		* @private
		*/
		requestHideTooltip: function () {
			this.waterfallDown('onRequestHideTooltip');
		}
	});

})(enyo, this);
