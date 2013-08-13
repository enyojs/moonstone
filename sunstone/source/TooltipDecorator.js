/**
	A control that activates a <a href="#sun.Tooltip">sun.Tooltip</a>. It
	surrounds a control such as a button and displays the tooltip when the
	control generates an _onEnter_ event:

		{kind: "sun.TooltipDecorator", components: [
			{kind: "sun.Button", content: "Tooltip"},
			{kind: "sun.Tooltip", content: "I'm a tooltip for a button."}
		]}

	Here's an example with a <a href="#sun.Input">sun.Input</a> control and a
	decorator around the input:

		{kind: "sun.TooltipDecorator", components: [
			{kind: "sun.InputDecorator", components: [
				{kind: "sun.Input", placeholder: "Just an input..."}
			]},
			{kind: "sun.Tooltip", content: "I'm a tooltip for an input."}
		]}
*/
enyo.kind({
	name: "sun.TooltipDecorator",
	kind: "moon.TooltipDecorator"	
});