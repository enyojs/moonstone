enyo.kind({
	name: "moon.sample.listactions.DataGridListSelectionSample",
	classes: "moon enyo-unselectable single-select-delete",
	deleteMode: false,
	components: [
		{name: "panel", kind: "moon.Panel", classes: "enyo-fit", title: "MOVIES", headerComponents: [
			{name: "multiButton", kind: "moon.ToggleButton", small: true, showing: false, classes: "moon-header-left", content: "Multiple Selection"},
			{name: "selectAllButton", kind: "moon.Button", small: true, showing: false, classes: "moon-header-left", content: "Select All", ontap: "selectAll"},
			{name: "deselectAllButton", kind: "moon.Button", small: true, showing: false, classes: "moon-header-left", content: "Deselect All", ontap: "deselectAll"},
			{name: "cancelButton", kind: "moon.Button", small: true, content: "cancel", showing: false, ontap: "cancel"},
			{name: "deleteButton", kind: "moon.Button", small: true, content: "delete", showing: false, ontap: "deleteSelected"},
			{name: "toggleButton", kind: "moon.IconButton", small: true, src: "../../assets/trash-can-icon.png", showing: true, ontap: "toggleMode"}
		], components: [
			{name: "list", selection: false, kind: "moon.DataGridList", components: [
				{						
					bindings: [
						{from: ".model.title", to: ".$.gridListItem.caption"},
						{from: ".model.coverSource", to: ".$.gridListItem.source"}
					],
					components: [
						{name: "gridListItem", classes: "single-select-delete-image-item", mixins: ["moon.SelectionOverlaySupport"], kind: "moon.GridListImageItem"}
					]
				}				
			], minHeight: 200, minWidth: 200, spacing: 50}
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
			for (var i=0, r=[]; i<200; ++i) {
				r.push({coverSource: "../../assets/default-music.png", title: "MOVIE NAME " + i});
			}
			c.add(r);
			this.$.list.set("controller", c);
		};
	})
});
