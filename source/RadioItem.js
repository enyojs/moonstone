/**
	_moon.RadioItem_ is a modified <a href="#enyo.Button">enyo.Button</a>
	control designed to be used inside a
	<a href="#moon.RadioItemGroup">moon.RadioItemGroup</a>.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.RadioItem",
	kind: "moon.Button",
	classes: "moon-item moon-radio-item",
	handlers: {
		onSpotlightFocus : 'focus',
		onSpotlightBlur	: 'blur'
	},

	//* @protected
	rendered: function() {
		this.inherited(arguments);
		this.contentWidth = this.getBounds().width;
		// Resize the button to fit RadioItem kerning state
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