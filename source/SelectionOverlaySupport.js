moon.SelectionOverlaySupport = {
	name: "moon.SelectionOverlaySupport",
	classes: "moon-selection-overlay-support",
	create: enyo.super(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.createChrome(this._selectionScrim);
		};
	}),
	_selectionScrim: [
		{classes: "enyo-fit moon-selection-overlay-support-scrim", components: [
			{kind: "moon.IconButton", classes: "moon-selection-overlay-support-checkbox", spotlight: false, src: "$lib/moonstone/images/icon-selection.png"}
		]}
	]
};