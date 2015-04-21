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
		], components: [
			{name: "gridList", fit: true, spacing: 20, minWidth: 180, minHeight: 180, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
				{ kind: "moon.sample.GridSampleItem" }
			]}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.dataList.collection"},
		{from: ".collection", to: ".$.gridList.collection"},
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
		this.set("collection", new enyo.Collection(this.generateRecords()));
	},
	generateRecords: function () {
		var records = [],
			idx     = this.modelIndex || 0;
		for (; records.length < 500; ++idx) {
			var title = (idx % 8 === 0) ? " with long title" : "";
			records.push({
				selected: false,
				text: "Item " + idx + title,
				id:idx,
				// If showS is false, then, textOverlayScrim will be hide
				show:false,
				url: "http://placehold.it/300x300/" + Math.floor(Math.random()*0x1000000).toString(16) + "/ffffff&text=Image " + idx
			});

		}
		// If showS is true, then, textOverlayScrim will be hide
		// user can set true or false, because it is publised property
		records[1].show=true;
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
	// moon.TextOverlaySupport is mixin
	mixins: ["moon.TextOverlaySupport", "moon.SelectionOverlaySupport"],
	// user can set how many lines are displayed
	overlayTextLineNum: 2,
	// user can set marquee is used or not
	// if useOverlayTextMarquee is set true, overlayTextLineNum property is ignored
	useOverlayTextMarquee: true,
	// user can set useSpotlightOverlayText is used or not
	// useSpotlightOverlayText propery makes only spotlighed item be shown
	// if useSpotlightOverlayText is set true, then showScrim property is ignored
	useSpotlightOverlayText: true,
	bindings: [
	// overlayText, overlaySubText, showScrim is published property
	// so user can use these properties for binding
		{from: ".model.text", to: ".overlayText"},
		{from: ".model.id", to: ".overlaySubText"},
		{from: ".model.show", to: ".showScrim"},
		{from: ".model.url", to: ".source"}
	]
});