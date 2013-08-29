enyo.kind({
	name: "moon.sample.listactions.DataListSelectionSample",
	classes: "moon enyo-unselectable single-select-delete",
	deleteMode: false,
	components: [
		{name: "panel", kind: "moon.Panel", classes: "enyo-fit", title: "MOVIES", headerComponents: [
			{name: "multiButton", kind: "moon.ToggleButton", small: true, showing: false, classes: "moon-header-left", content: "Multiple Selection"},
			{name: "selectAllButton", kind: "moon.Button", small: true, showing: false, classes: "moon-header-left", content: "Select All", ontap: "selectAll"},
			{name: "deselectAllButton", kind: "moon.Button", small: true, showing: false, classes: "moon-header-left", content: "Deselect All", ontap: "deselectAll"},
			{name: "cancelButton", kind: "moon.Button", small: true, content: "cancel", showing: false, ontap: "cancel"},
			{name: "deleteButton", kind: "moon.Button", small: true, content: "delete", showing: false, ontap: "deleteSelected"},
			{name: "toggleButton", kind: "moon.IconButton", small: true, src: "$lib/moonstone/images/icon-selection.png", showing: true, ontap: "toggleMode"}
		], components: [
			{name: "list", selection: false, kind: "moon.DataList", components: [
				{classes: "single-select-delete-image-item", mixins: ["moon.SelectionOverlaySupport"], kind: "moon.ImageItem", bindings: [
					{from: ".model.title", to: ".label"},
					{from: ".model.description", to: ".text"},
					{from: ".model.coverSource", to: ".source"}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".deleteMode", to: ".$.cancelButton.showing"},
		{from: ".deleteMode", to: ".$.deleteButton.showing"},
		{from: ".deleteMode", to: ".$.multiButton.showing"},
		{from: ".deleteMode", to: ".$.toggleButton.showing", kind: "enyo.InvertBooleanBinding"},
		{from: ".deleteMode", to: ".$.panel.titleBelow", transform: "modeTitle"},
		{from: ".deleteMode", to: ".$.list.selection"},
		{from: ".$.multiButton.value", to: ".$.selectAllButton.showing", transform: "andedTransform"},
		{from: ".deleteMode", to: ".$.selectAllButton.showing", transform: "andedTransform"},
		{from: ".$.multiButton.value", to: ".$.deselectAllButton.showing", transform: "andedTransform"},
		{from: ".deleteMode", to: ".$.deselectAllButton.showing", transform: "andedTransform"},
		{from: ".$.multiButton.value", to: ".$.list.multipleSelection", transform: "multiSelectionTransform"},
		{from: ".$.list.selected", to: ".$.deleteButton.disabled", transform: "disabledDeleteTransform"}
	],
	modeTitle: function (value) {
		return value && "Delete Mode" || "";
	},
	andedTransform: function (value) {
		return this.deleteMode && this.$.multiButton.value;
	},
	multiSelectionTransform: function (value) {
		var r = value && this.deleteMode;
		if (!r) {
			this.$.list.deselectAll();
		}
		return r;
	},
	disabledDeleteTransform: function (value) {
		return ! (value && (enyo.isArray(value)? value.length: true));
	},
	selectAll: function () {
		this.$.list.selectAll();
	},
	deselectAll: function () {
		this.$.list.deselectAll();
	},
	toggleMode: function () {
		this.set("deleteMode", !this.deleteMode);
		return true;
	},
	cancel: function () {
		this.$.list.deselectAll();
		this.set("deleteMode", false);
	},
	deleteSelected: function () {
		this.$.list.controller.remove(this.$.list.get("selected"));
		this.cancel();
	},
	rendered: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			var c = new enyo.Collection();
			for (var i=0, r=[]; i<25; ++i) {
				r.push({coverSource: "../../assets/default-movie.png", title: "MOVIE NAME " + i, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
					"Integer sit amet dolor aliquam, elementum eros eget, lobortis orci. Aliquam ac risus urna. Nullam imperdiet neque sed diam posuere, " +
					"accumsan malesuada erat pellentesque. Sed pretium lobortis magna, ut pellentesque tellus posuere in. Nunc tristique fermentum commodo. " +
					"Nullam rhoncus elit mi, at laoreet tortor euismod non. Proin at aliquet enim."});
			}
			c.add(r);
			this.$.list.set("controller", c);
		};
	})
});
