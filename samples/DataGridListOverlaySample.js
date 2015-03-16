enyo.kind({
	name: "moon.sample.DataGridListOverlaySample",
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
		{kind: "moon.Panel", joinToPrev: true, title:"Data Grid List", headerComponents: [
			{kind: "moon.ToggleButton", content:"Selection", name:"selectionToggle"},
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
			{kind: "moon.ContextualPopupDecorator", components: [
				{kind: "moon.ContextualPopupButton", content:"Badge Type"},
				{kind: "moon.ContextualPopup", classes:"moon-4h", components: [
					{kind: "moon.RadioItemGroup", name: "badgeTypeGroup", components: [
						{content: "Image", value: "image", selected: true},
						{content: "Video", value: "video"},
						{content: "Audio", value: "audio"}
					]}
				]}
			]},
			{kind: "moon.ContextualPopupDecorator", components: [
				{kind: "moon.ContextualPopupButton", content:"Badge Position"},
				{kind: "moon.ContextualPopup", classes:"moon-4h", components: [
					{kind: "moon.RadioItemGroup", name: "badgePositionGroup", components: [
						{content: "Top", value: "top", selected: true},
						{content: "Bottom", value: "bottom"}
					]}
				]}
			]}
		], components: [
			{name: "gridList", fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
				{ kind: "moon.sample.GridSampleItem" }
			]}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.gridList.collection"},
		{from: ".$.selectionToggle.value", to: ".$.gridList.selection", oneWay: false},
		{from: ".$.selectionTypeGroup.active", to: ".$.gridList.selectionType",
			transform: function (selected) {
				return selected && selected.value;
			}
		},
		{from: ".$.badgeTypeGroup.active", to: ".gridItemBadgeType",
			transform: function (selected) {
				return selected && selected.value;
			}
		},
		{from: ".$.badgePositionGroup.active", to: ".gridItemBadgePosition",
			transform: function (selected) {
				return selected && selected.value;
			}
		}
	],
	observers: {
		refreshItems: ['gridItemBadgeType', 'gridItemBadgePosition']
	},
	create: function () {
		this.inherited(arguments);
		// we set the collection that will fire the binding and add it to the list
		this.set("collection", new enyo.Collection(this.generateRecords()));
	},
	generateRecords: function () {
		var records = [],
			idx     = 0;
		for (; records.length < 500; ++idx) {
			var title = (idx % 8 === 0) ? " with long title" : "";
			var subTitle = (idx % 8 === 0) ? "Lorem ipsum dolor sit amet" : "Subtitle";
			records.push({
				selected: false,
				text: "Item " + idx + title,
				subText: subTitle,
				badgeType: this.gridItemBadgeType,
				position: this.gridItemBadgePosition,
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
	mixins: ["moon.BadgeOverlaySupport", "moon.SelectionOverlaySupport"],
	subCaption: "Sub Caption",
	bindings: [
		{from: ".model.text", to: ".caption"},
		{from: ".model.subText", to: ".subCaption"},
		{from: ".model.url", to: ".source"},
		{from: ".model.badgeType", to: ".badgeType"},
		{from: ".model.position", to: ".position"}
	]
});