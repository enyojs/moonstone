/**
	_moon.IconButton_ is an icon that acts like a button. Specify the icon image
	by setting the _src_ property to a URL indicating the image file's location.

	If you want to combine an icon with text inside a button, use a
	<a href="#moon.Icon">moon.Icon</a> inside a	<a href="#moon.Button">moon.Button</a>.

	In Moonstone, we support two (2) methods for displaying icons: a traditional
	image asset (using the “_src_” property); and an icon stored as a single
	character in a special symbol font (using the “_icon_” property and setting
	an icon name as the value). Font-based icon name-to-character references are
	stored in “css/moonstone-icons.less” This associates an icon name with the
	font’s character or symbol.

	There are also two sizes of icons supported: large (45x45 pixels); and small
	(32x32 pixels). Icons are small by default. To specify a large icon, set the
	"_small_" property to false. Each icon size also supports two states: the
	top, a resting state and the bottom, pressed or active state.

	Large-sized icon image assets should have dimensions of 45x90. This allows
	for 2 icon states, with a 15 pixel transparent padding around each 45x45
	icon.

	Small-sized icon image assets should have dimensions of 50x100. This allows
	for 2 icon states, with a 9 pixel transparent padding around each 32x32
	icon.

	Since the asset-based icon image is applied as a CSS background, the height
	and width of an icon must be set if an image of a different size is used.

		{kind: "moon.IconButton", src: "images/search.png"}
		or
		{kind: "moon.IconButton", icon: "closex"}
		or
		{kind: "moon.IconButton", src: "images/search.png", small: false}
		or
		{kind: "moon.IconButton", icon: "closex", small: false}

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
		active: false,
		/**
			A parameter indicating the size of the button.
			If true, the diameter of this button is 60px.
			However, the button's tap target still has a diameter of 78px, so there is
			invisible DOM that wraps the small button to provide the larger tap zone.
		*/
		small: true
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
		onSpotlightFocused: "spotlightFocused",
		onSpotlightBlur: "undepress"
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
		if (inEvent.originator === this) {
			this.bubble("onRequestScrollIntoView", {side: "top"});
		}
	}
});
