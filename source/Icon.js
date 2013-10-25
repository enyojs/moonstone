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
		/**
			Specify the icon name from the following list
			[list of available icons here]
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
	classes: "moon-icon",
	//* @protected
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