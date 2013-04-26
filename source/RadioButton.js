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
	classes: "moon-item moon-radio-button",
	handlers: {
		onSpotlightFocus : 'focus',
		onSpotlightBlur	: 'blur'
	},
	
	//* @protected
	rendered: function() {
		this.inherited(arguments);
		this.contentWidth = this.getBounds().width;
		// Resize the button to fit RadioButton kerning state
		//25 extra pixels to make room for spotlight focus
		this.applyStyle("width", this.contentWidth + 25 + "px");
	},
	focus: function(inSender, inEvent) {
		this.bubble(inSender, inEvent);
		// return false;
	},
	blur: function(inSender, inEvent) {
		this.bubble(inSender, inEvent);
		// return false;
	},
	contentWidth: 0
});