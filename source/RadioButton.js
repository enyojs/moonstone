/**
	A modified "enyo.Button" control intended to be used
	within a <a href="#moon.RadioButtonGroup">moon.RadioButtonGroup</a>.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.RadioButton",
	kind: "moon.Button",
	classes: "moon-radio-button",	
	//* @protected
	rendered: function() {
		this.inherited(arguments);
		this.contentWidth = this.getBounds().width;
		// Resize the button to fit RadioButton kerning state
		this.applyStyle("width", this.contentWidth + "px");
	},
	contentWidth: 0
});