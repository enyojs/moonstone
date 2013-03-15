/**
	_moon.IconButton_ is an icon that acts like a button. The icon image is
	specified by setting the _src_ property to a URL.

	If you want to combine an icon with text inside a button, use an
	<a href="#moon.Icon">moon.Icon</a> inside an
	<a href="#moon.Button">moon.Button</a>.

	The image associated with the _src_ property of the IconButton is assumed
	to be 32x64-pixel strip with the top half showing the button's normal state
	and the bottom half showing its state when hovered-over or active.

	For more information, see the documentation on
	[Buttons](https://github.com/enyojs/enyo/wiki/Buttons) in the Enyo Developer
	Guide.
*/
enyo.kind({
	name: "moon.IconButton",
	kind: "moon.Icon",
	published: {
		//* Used when the IconButton is part of a <a href="#enyo.Group">enyo.Group</a>, true
		//* to indicate that this is the active button of the group, false otherwise.
		active: false
	},
	classes: "moon-icon-button",
	//* @protected
	spotlight: true,
	handlers: {
		onSpotlightSelect: "spotFocus",
		onSpotlightFocused: "spotFocused"
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
	spotFocus: function() {
		this.addClass("pressed");
	},
	spotFocused: function() {
		this.removeClass("pressed");
	}
});
