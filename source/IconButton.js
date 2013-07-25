/**
	_moon.IconButton_ is an icon that acts like a button. Specify the icon image
	by setting the _src_ property to a URL indicating the image file's location.

	If you want to combine an icon with text inside a button, use a
	<a href="#moon.Icon">moon.Icon</a> inside a	<a href="#moon.Button">moon.Button</a>.

	The image associated with the _src_ property of the IconButton is assumed
	to be a 32x64-pixel strip, with the top half showing the button's normal state
	and the bottom half showing its state when hovered-over or active.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.IconButton",
	kind: "moon.Icon",
	published: {
		/**
			Used when the IconButton is part of an <a href="#enyo.Group">enyo.Group</a>.
			A value of true indicates that this is the active button of the group;
			false, that it is not the active button.
		*/
		active: false
	},
	classes: "moon-icon-button",
	//* @protected
	spotlight: true,
	handlers: {
		//* onSpotlightSelect simulates mousedown
		onSpotlightSelect: "depress",
		//* onSpotlightKeyUp simulates mouseup
		onSpotlightKeyUp: "undepress",
		//* used to request it is in view in scrollers
		onSpotlightFocused: "spotlightFocused"
	},
	rendered: function() {
		this.inherited(arguments);
		this.activeChanged();
	},
	tap: function() {
		if (this.disabled) {
			return true;
		}
		this.setActive(true);
	},
	activeChanged: function() {
		this.bubble("onActivate");
	},
	//* Adds _pressed_ CSS class.
	depress: function() {
		this.addClass("pressed");
	},
	//* Removes _pressed_ CSS class.
	undepress: function() {
		this.removeClass('pressed');
	},
	spotlightFocused: function(inSender, inEvent) {
		this.bubble("onRequestScrollIntoView", {side: "top"});
	}
});
