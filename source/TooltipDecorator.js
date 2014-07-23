/**
	A control that activates a [moon.Tooltip](#moon.Tooltip). It surrounds a
	control such as a button and displays the tooltip when the control generates
	an _onEnter_ event:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.Button", content: "Tooltip"},
			{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
		]}

	Here's an example with a [moon.Input](#moon.Input) control and a decorator
	around the input:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Just an input..."}
			]},
			{kind: "moon.Tooltip", content: "I'm just a tooltip for an input."}
		]}

	Automatic hiding and showing of tooltips may be disabled by calling _mute()_
	or by bubbling the _onRequestMuteTooltip_ event; it may be re-enabled by
	calling _unmute()_ or by bubbling the _onRequestUnmuteTooltip_ event.
*/
enyo.kind({
	name: "moon.TooltipDecorator",
	//* @protected
	defaultKind: "moon.Button",
	classes: "moon-contextual-popup-decorator",
	handlers: {
		//onenter: "enter",
		onmouseover: "enter",
		// onleave: "leave",
		onmouseout: "leave",
		onSpotlightFocused: "spotFocused",
		onSpotlightBlur: "spotBlur",
		onRequestMuteTooltip: "mute",
		onRequestUnmuteTooltip: "unmute"
	},
	//* @public 
	published: {
		/**
			Boolean indicating whether tooltips are automatically shown when the
			activator is hovered over
		*/
		autoShow: true
	},
	//* @public
	//* Disables automatic tooltip showing/hiding.
	mute: function() {
		this.setAutoShow(false);
	},
	//* Re-enables automatic tooltip showing/hiding after being muted.
	unmute: function() {
		this.setAutoShow(true);
	},
	//* @protected
	autoShowChanged: function() {
		if (!this.autoShow) {
			this.requestHideTooltip();
		}
	},
	enter: function(inEvent) {
		this.requestShowTooltip();
	},
	leave: function() {
		this.requestHideTooltip();
	},
	spotFocused: function() {
		this.requestShowTooltip();
	},
	spotBlur: function() {
		this.requestHideTooltip();
	},
	tap: function() {
		this.requestHideTooltip();
	},
	requestShowTooltip: function() {
		if (this.autoShow && !enyo.Spotlight.isFrozen()) {
			this.waterfallDown("onRequestShowTooltip");
		}
	},
	requestHideTooltip: function() {
		this.waterfallDown("onRequestHideTooltip");
	}
});
