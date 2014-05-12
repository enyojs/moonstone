/**
	_moon.Image_ is a simple control that wraps an [enyo.Image](#enyo.Image) to
	provide proper alignment with text-based controls.

	In addition, _moon.Image_ accepts optional [moon.ImageBadge](#moon.ImageBadge)
	client components, which are placed inside a container positioned over the
	image.  These badges are normally persistent, but may be shown or hidden based
	on spotlight focus, using the _showBadgesOnSpotlight_ property.

		{kind: "moon.Image", src: "assets/movie.png", showBadgesOnSpotlight: true, components: [
			{src: "assets/icon-recommended.png"},
			{src: "assets/icon-favorite.png"},
			{src: "assets/icon-new/png", classes: "float-right"}
		]}
*/

enyo.kind({
	name: "moon.Image",
	kind: "enyo.Control",
	//* @protected
	classes: "moon-image",
	//* @public
	published: {
		//* The URL of the image
		src: "",
		/** 
			The alt text of the image
			alt property is not working in webkit.
		*/
		alt: "",
		/**
			When true, badges will only be shown when the image is within a
			spotlightable component that has focus.  Otherwise, any badges provided
			will always be shown.
		*/
		showBadgesOnSpotlight: false,
		//* The image sizing strategy.  See _enyo.Image_ for details.
		sizing: "",
		//* The image position when _sizing_ is used.  See _enyo.Image_ for details.
		position: ""
	},
	//*@protected
	defaultKind: "moon.ImageBadge",
	components: [
		{name: "image", kind: "enyo.Image"},
		{name: "client", kind: "enyo.Control", canGenerate: false, classes: "moon-image-client"}
	],
	bindings: [
		{from: ".src", to: ".$.image.src"},
		{from: ".alt", to: ".$.image.alt"},
		{from: ".sizing", to: ".$.image.sizing"},
		{from: ".position", to: ".$.image.position"}
	],
	//* Only generate _this.$.client_ if the instance has components.
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
