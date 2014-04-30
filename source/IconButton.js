/**
	_moon.IconButton_ is an icon that acts like a button. Specify the icon image
	by setting the _src_ property to a URL indicating the image file's location.

		{kind: "moon.IconButton", src: "images/search.png"}

	If you want to combine an icon with text inside of a button, use a
	[moon.Icon](#moon.Icon) inside a [moon.Button](#moon.Button).

	Moonstone supports two methods for displaying icons; in addition to using
	traditional image assets specified in _src_, you may use icons that are
	stored as single characters in a special symbol font. To do this, set the
	value of the _icon_ property to a string representing an icon name, e.g.:

		{kind: "moon.IconButton", icon: "closex"}

	The name-to-character mappings for font-based icons are stored in
	_css/moonstone-icons.less_. Each mapping associates an icon name with the icon
	font's corresponding character or symbol.

	See [moon.Icon](#moon.Icon) for more information on the available font-based
	icons, as well as specifications for icon image assets.
*/
enyo.kind({
	name: "moon.IconButton",
	kind: "moon.Icon",
	//* @public
	published: {
		/**
			Used when the IconButton is part of an [enyo.Group](#enyo.Group).
			A value of true indicates that this is the active button of the group;
			false, that it is not the active button.
		*/
		active: false,
		/**
			A boolean parameter affecting the size of the button.
			If true, the button will have a diameter of 60px.
			However, the button's tap target will still have a diameter of 78px, with
			invisible DOM wrapping the small button to provide the larger tap zone.
		*/
		small: true,
		//* When true, the button will have no rounded background color/border
		noBackground: false
	},
	//* @protected
	classes: "moon-icon-button",
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
	create: function() {
		this.inherited(arguments);
		this.noBackgroundChanged();
	},
	rendered: function() {
		this.inherited(arguments);
		this.activeChanged();
	},
	noBackgroundChanged: function() {
		this.addRemoveClass("no-background", this.noBackground);
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
			this.bubble("onRequestScrollIntoView");
		}
	}
});
