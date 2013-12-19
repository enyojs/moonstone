/**
	_moon.SelectionOverlaySupport_ is a mixin that may be applied to any
	_moon.DataList_/_moon.DataGridList_ item to provide an overlay that is
	activated when the list is in selection mode.

	The selection overlay has three visual states: focused but not selected,
	focused and selected, and selected but not focused.

	The item may define a _selectionScrimIcon_ URL to override the default icon.

		{name: "list", selection: false, kind: "moon.DataList", components: [
			{mixins: ["moon.SelectionOverlaySupport"], selectionScrimIcon: "assets/my-icon.png",
				kind: "moon.ImageItem", bindings: [
					{from: ".model.title", to: ".label"},
					{from: ".model.description", to: ".text"},
					{from: ".model.coverSource", to: ".source"}
				]
			}
		]}

*/
moon.SelectionOverlaySupport = {
	name: "moon.SelectionOverlaySupport",
	//* @protected
	classes: "moon-selection-overlay-support",
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.createChrome(this._selectionScrim);
			this.selectionOverlayHorizontalOffset = this.selectionOverlayHorizontalOffset === undefined ? 50 : this.selectionOverlayHorizontalOffset;
			this.selectionOverlayVerticalOffset = this.selectionOverlayVerticalOffset === undefined ? 50 : this.selectionOverlayVerticalOffset;
			this.selectionOverlayHorizontalOffsetChanged();
			this.selectionOverlayVerticalOffsetChanged();
			// Allow the icon to be modified by user
			this.selectionScrimIcon = this.selectionScrimIcon || "$lib/moonstone/images/icon-selection.png";
		};
	}),
	bindings: [
		{from: ".selectionScrimIcon", to: ".$.selectionScrimIcon.src"}
	],
	_selectionScrim: [
		{classes: "enyo-fit moon-selection-overlay-support-scrim", components: [
			{name:"selectionScrimIcon", kind: "moon.IconButton", classes: "moon-selection-overlay-support-checkbox", spotlight: false}
		]}
	],
	selectionOverlayVerticalOffsetChanged: function() {
		this.$.selectionScrimIcon.applyStyle("top", this.selectionOverlayVerticalOffset + "%");
	},
	selectionOverlayHorizontalOffsetChanged: function() {
		this.$.selectionScrimIcon.applyStyle((this.rtl ? "right" : "left"), this.selectionOverlayHorizontalOffset + "%");
	}
};