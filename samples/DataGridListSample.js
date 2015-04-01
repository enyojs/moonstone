enyo.kind({
	name: "moon.sample.DataGridListSample",
	kind: "moon.Panels",
	pattern: "activity",
	classes: "moon enyo-fit enyo-unselectable",
	components: [
		{kind: "moon.Panel", classes:"moon-6h", title:"Menu", components: [
			{kind:"moon.Item", content:"Scroll"},
			{kind:"moon.Item", content:"the"},
			{kind:"moon.Item", content:"Data Grid List"},
			{kind:"moon.Item", content:"to"},
			{kind:"moon.Item", content:"the"},
			{kind:"moon.Item", content:"Right!"}
		]},
		{name: 'dataListPanel', kind: "moon.Panel", joinToPrev: true, title:"Data Grid List", headerComponents: [
			{kind: "moon.ToggleButton", content:"Selection", name:"selectionToggle"},
			{kind: "moon.ContextualPopupDecorator", components: [
				{kind: "moon.ContextualPopupButton", content:"Item Type"},
				{kind: "moon.ContextualPopup", classes:"moon-4h", components: [
					{kind: "moon.RadioItemGroup", name: "itemTypeGroup", components: [
						{content: "GridList Image Item", value: "GridListImageItem", selected: true},
						{content: "Horizontal Image Item", value: "HorizontalGridListImageItem"}
					]}
				]}
			]},
			{kind: "moon.ContextualPopupDecorator", components: [
				{kind: "moon.ContextualPopupButton", content:"Selection Type"},
				{kind: "moon.ContextualPopup", classes:"moon-4h", components: [
					{kind: "moon.RadioItemGroup", name: "selectionTypeGroup", components: [
						{content: "Single", value: "single", selected: true},
						{content: "Multiple", value: "multi"},
						{content: "Group", value: "group"}
					]}
				]}
			]},
			{kind: "moon.Button", content:"Refresh", ontap:"refreshItems"},
			{kind: "moon.ContextualPopupDecorator", components: [
				{kind: "moon.ContextualPopupButton", content:"Popup List"},
				{kind: "moon.ContextualPopup", classes:"moon-6h moon-8v", components: [
					{kind:"moon.DataList", components: [
						{kind:"moon.CheckboxItem", bindings: [
							{from:".model.text", to:".content"},
							{from:".model.selected", to: ".checked", oneWay: false}
						]}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.dataList.collection"},
		{from: ".collection", to: ".$.gridList.collection"},
		{from: ".$.itemTypeGroup.active", to: ".$.gridList.itemType",
			transform: function (selected) {
				if (selected && selected.value) {
					this.selectItemType(selected.value);
				}
			}
		},
		{from: ".$.selectionTypeGroup.active", to: ".$.gridList.selectionType",
			transform: function (selected) {
				return selected && selected.value;
			}
		},
		{from: ".$.selectionToggle.value", to: ".$.gridList.selection", oneWay: false}
	],
	create: function () {
		this.inherited(arguments);
		// we set the collection that will fire the binding and add it to the list
		this.set("collection", new enyo.Collection(this.generateRecords(500)));
	},
	selectItemType: function(value) {
		if (this.$.gridList) {
			this.$.gridList.destroy();
		}

		switch (value) {
		case 'GridListImageItem':
			this.$.dataListPanel.createComponent(
				{name: "gridList", fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
					{kind: "moon.sample.GridSampleItem"}
				]}, {owner: this}
			);
			break;
		case 'HorizontalGridListImageItem':
			this.$.dataListPanel.createComponent(
				{name: "gridList", fit: true, spacing: 20, minWidth: 600, minHeight: 100, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
					{kind: "moon.HorizontalGridListImageItem"}
				]}, {owner: this}
			);
			break;
		}

		this.$.dataListPanel.render();
		this.set("collection", new enyo.Collection(this.generateRecords(4)));
	},
	generateRecords: function (count) {
		var records = [],
			idx     = this.modelIndex || 0;
		for (; records.length < count; ++idx) {
			var title = (idx % 8 === 0) ? " with long title" : "";
			var subTitle = (idx % 8 === 0) ? "Lorem ipsum dolor sit amet" : "Subtitle";
			records.push({
				selected: false,
				text: "Item " + idx + title,
				subText: subTitle,
				url: "http://placehold.it/300x300/" + Math.floor(Math.random()*0x1000000).toString(16) + "/ffffff&text=Image " + idx
			});
		}
		// update our internal index so it will always generate unique values
		this.modelIndex = idx;
		return records;
	},
	refreshItems: function () {
		// we fetch our collection reference
		var collection = this.get("collection");
		// we now remove all of the current records from the collection
		collection.remove(collection.models);
		// and we insert all new records that will update the list
		collection.add(this.generateRecords());
	}
});

enyo.kind({
	name: "moon.sample.GridSampleItem",
	kind: "moon.GridListImageItem",
	mixins: ["moon.SelectionOverlaySupport"],
	selectionOverlayVerticalOffset: 35,
	subCaption: "Sub Caption",
	bindings: [
		{from: ".model.text", to: ".caption"},
		{from: ".model.subText", to: ".subCaption"},
		{from: ".model.url", to: ".source"}
	]
});

enyo.kind({
	name: 'moon.HorizontalGridListImageItem',
	kind: 'moon.GridListImageItem',
	mixins: ["moon.SelectionOverlaySupport"],

	selectionOverlayVerticalOffset: 50,
	selectionOverlayHorizontalOffset: 90,
	centered: false,

	events: {
		onSelectionEnable: ''
	},

	classes: 'horizontal',

	create: function() {
		this.inherited(arguments);

		this.createComponent({name: 'captionArea', classes: 'captionArea'});
		this.$.caption.setContainer(this.$.captionArea);
		this.$.subCaption.setContainer(this.$.captionArea);
	}
});
