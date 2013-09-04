/**
	_moon.Icon_ is a control that displays an icon image. Specify the image by
	setting the _src_ property to a URL indicating the image file's location.

	In Moonstone, icons have a size of 32x32 pixels. Since the icon image is
	applied as a CSS background, the height and width of an icon must be set if an
	image of a different size is used.

		{kind: "moon.Icon", src: "images/search.png"}

	For situations in which an icon should act like a button, use
	<a href="#moon.IconButton">moon.IconButton</a>.
*/
enyo.kind({
	name: "moon.Icon",
	published: {
		//* URL specifying path to icon image
		src: "",
		//* When true, icon is shown as disabled
		disabled: false
	},
	classes: "moon-icon",
	//* @protected
	create: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			if (this.src) {
				this.srcChanged();
			}
			this.disabledChanged();
		};
	}),
	disabledChanged: function() {
		this.addRemoveClass("disabled", this.disabled);
	},
	srcChanged: function() {
		this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
	}
});