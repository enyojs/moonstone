/**
	_moon.Icon_ is a control that displays an icon image. Specify the image by
	setting the _src_ property to a URL indicating the image file's location.

		{kind: "moon.Icon", src: "images/search.png"}

	Moonstone actually supports two methods for displaying icons; in addition to
	using traditional image assets specified in _src_, you may use icons that are
	stored as single characters in a special symbol font. To do this, set the
	value of the _icon_ property to a string representing an icon name, e.g.:

		{kind: "moon.Icon", icon: "closex"}

	The name-to-character definitions for font-based icons are stored in
	_css/moonstone-icons.less_. Each definition associates an icon name with the
	icon font's corresponding character or symbol.

	Two sizes of icons are supported: large (45x45 pixels) and small (32x32
	pixels). Icons are small by default. To specify a large icon, set the _small_
	property to _false_:

		{kind: "moon.Icon", src: "images/search.png", small: false}

		{kind: "moon.Icon", icon: "closex", small: false}

	In addition, each icon size supports two states: on top, a resting state, and
	on the bottom, a pressed or active state.

	Large-sized icon image assets should be 75px wide and 150px high. This allows
	room for the two icon states, with 15 pixels of transparent padding around
	each 45x45 icon.

	Small-sized icon image assets should be 50px wide and 100px high. This allows
	room for the two icon states, with 9 pixels of transparent padding around each
	32x32 icon.

	Since an asset-based icon image is applied as a CSS background, the height
	and width of an icon must be set if an image of a different size is used.

	For situations in which an icon should act like a button, use
	[moon.IconButton](#moon.IconButton).
*/
enyo.kind({
	name: "moon.Icon",
	//* @public
	published: {
		/**
			When using a font-based icon, the name of the icon to be used.
			The following icon names are valid:

			* "drawer"
			* "arrowlargeup"
			* "arrowlargedown"
			* "arrowlargeleft"
			* "arrowlargeright"
			* "arrowsmallup"
			* "arrowsmalldown"
			* "arrowsmallleft"
			* "arrowsmallright"
			* "closex"
			* "check"
			* "search"
		*/
		icon: "",
		//* URL specifying path to icon image
		src: "",
		//* When true, icon is shown as disabled
		disabled: false,
		/**
			A parameter indicating the size of the button.
			If true, the diameter of this button is 60px.
			However, the button's tap target still has a diameter of 78px, so there is
			invisible DOM that wraps the small button to provide the larger tap zone.
		*/
		small: true
	},
	getSrc: function () {
		return this.src;
	},
	//* @protected
	classes: "moon-icon",

	create: function() {
		this.inherited(arguments);
		if (this.src) {
			this.srcChanged();
		}
		if (this.icon) {
			this.iconChanged();
		}
		this.smallChanged();
		this.disabledChanged();
	},
	getIconClass: function(inIconName) {
		return "moon-icon-" + (inIconName || this.icon);
	},
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
	},
	srcChanged: function() {
		this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
	},
	iconChanged: function(inOld) {
		if (inOld) {
			this.removeClass(this.getIconClass(inOld));
		}
		this.addClass(this.getIconClass());
	},
	smallChanged: function() {
		if (this.$.tapArea) {
			this.$.tapArea.destroy();
		}

		if (this.small) {
			var ta = this.createComponent({name: "tapArea", classes: "small-icon-tap-area", isChrome: true});
			if (this.generated) {
				ta.render();
			}
		}
		this.addRemoveClass("small", this.small);
	}
});