/**
	_moon.Image_ is a simple control that wraps an <a href="#enyo.Image">enyo.Image</a> to
	provide proper alignment with text-based contols.

	In addition, _moon.Image_ optionally accepts <a href="#moon.ImageBadge">moon.ImageBadge</a> client
	components, placed inside a container positioned over the image.  The badges are normally persistent,
	but can be shown/hidden based on spotlight focus as well, using the `showBadgesOnSpotlight` property.

	Example usage: 

			{kind: "moon.Image", src: "assets/movie.png", showBadgesOnSpotlight:true, components: [
				{src: "assets/icon-recommended.png"},
				{src: "assets/icon-favorite.png"},
				{src: "assets/icon-new/png", classes: "float-right"}
			]}
*/

enyo.kind({
	name: "moon.Image",
	kind: "enyo.Control",
	classes: "moon-image",
	//*@public
	published: {
		//* The URL of the image
		src: "",
		//* The alt text of the image
		alt: "",
		//* When true, badges will only be shown when the image is placed within a spotlightable
		//* component and that component has focus.  Otherwise the badges are always shown if provided.
		showBadgesOnSpotlight: false
	},
	defaultKind: "moon.ImageBadge",
	//*@protected
	components: [
		{name: "image", kind: "enyo.Image"},
		{name: "client", kind: "enyo.Control", canGenerate: false, classes: "moon-image-client"}
	],
	bindings: [
		{from: ".src", to: ".$.image.src"},
		{from: ".alt", to: ".$.image.alt"}
	],
	//* Only generate _this.$.client_ if the instance has components
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			if (this.getClientControls().length > 0) {
				this.$.client.canGenerate = true;
				this.addClass("has-children");
			}
			
			this.showBadgesOnSpotlightChanged();
		};
	}),
	showBadgesOnSpotlightChanged: function() {
		this.addRemoveClass("show-on-spotlight", this.getShowBadgesOnSpotlight());
	}
});
