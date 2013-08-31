/**
	A control that activates a <a href="#moon.Tooltip">moon.Tooltip</a>. It
	surrounds a control such as a button and displays the tooltip when the
	control generates an _onEnter_ event:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.Button", content: "Tooltip"},
			{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
		]}

	Here's an example with a <a href="#moon.Input">moon.Input</a> control and a
	decorator around the input:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Just an input..."}
			]},
			{kind: "moon.Tooltip", content: "I'm a tooltip for an input."}
		]}

	Automatic hiding/showing of tooltips can be disabled by calling `mute()` or by
	bubbling the `onRequestMuteTooltip` event, and re-enabled by calling `unmute()` or
	by bubbling the `onRequestUnmuteTooltip` event.
*/
enyo.kind({
	name: "moon.TooltipDecorator",
	defaultKind: "moon.Button",
	//* @protected
	classes: "moon-contextual-popup-decorator",
	handlers: {
		onenter: "enter",
		onleave: "leave",
		onSpotlightFocused: "spotFocused",
		onSpotlightBlur: "spotBlur",
		onRequestMuteTooltip: "mute",
		onRequestUnmuteTooltip: "unmute"
	},
	published: {
		//* Determines whether tooltips are automatically shown when the activator is hovered
		autoShow: true
	},
	//* @public
	//* Causes automatic tooltip showing/hiding to be disabled
	mute: function() {
		this.setAutoShow(false);
	},
	//* Re-enables automatic tooltip showing/hiding after being muted
	unmute: function() {
		this.setAutoShow(true);
	},
	//* @protected
	autoShowChanged: function() {
		if (!this.autoShow) {
			this.requestHideTooltip();
		}
	},
	enter: function() {
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
		if (this.autoShow) {
			this.waterfallDown("onRequestShowTooltip");
		}
	},
	requestHideTooltip: function() {
		this.waterfallDown("onRequestHideTooltip");
	}
});
