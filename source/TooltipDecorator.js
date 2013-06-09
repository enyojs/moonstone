/**
	A control that activates an <a href="#moon.Tooltip">moon.Tooltip</a>. It
	surrounds a control such as a button and displays the tooltip when the
	control generates an _onEnter_ event:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.Button", content: "Tooltip"},
			{kind: "moon.Tooltip", content: "I'm a tooltip for a button."}
		]}

	Here's an example with an <a href="#moon.Input">moon.Input</a> control and a
	decorator around the input:

		{kind: "moon.TooltipDecorator", components: [
			{kind: "moon.InputDecorator", components: [
				{kind: "moon.Input", placeholder: "Just an input..."}
			]},
			{kind: "moon.Tooltip", content: "I'm a tooltip for an input."}
		]}
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
		onSpotlightBlur: "spotBlur"
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
		this.waterfallDown("onRequestShowTooltip");
	},
	requestHideTooltip: function() {
		this.waterfallDown("onRequestHideTooltip");
	}
});