enyo.kind({
	name: "moon.sample.DataGridListSample",
	kind: "moon.Panels",
	pattern: "activity",
	classes: "moon enyo-fit",
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
			{kind: "moon.ToggleButton", content:"MultiSelect", name:"multiSelectToggle"},
			{kind: "moon.ToggleButton", content: "GroupSelect", name: "groupSelectToggle"},
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
			{name: "gridList", fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
				{ kind: "moon.sample.GridSampleItem" }
			]}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.dataList.collection"},
		{from: ".collection", to: ".$.gridList.collection"},
		{from: ".$.selectionToggle.value", to:".$.gridList.selection", oneWay: false},
		{from: ".$.multiSelectToggle.value", to:".$.gridList.multipleSelection", oneWay: false},
		{from: ".$.groupSelectToggle.value", to: ".$.gridList.groupSelection", oneWay: false}
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