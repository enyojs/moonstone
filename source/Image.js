enyo.kind({
	name: "moon.Image",
	kind: "enyo.Control",
	classes: "moon-image",
	published: {
		src: "",
		alt: "",
		showBadgesOnSpotlight: false
	},
	defaultKind: "moon.ImageBadge",
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
