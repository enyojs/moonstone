enyo.kind({
	name: "moon.ScrollThumb",
	kind: "enyo.TransitionThumb",
	published: {
		sizeRatio: 1
	},
	//* @protected
	classes: "moon-thumb matrix3dsurface",
	//* Minimum size of the indicator
	minSize: 20,
	calcContainerSize: function() {
		return this.scrollBounds[this.sizeDimension] * this.getSizeRatio()
	}
});