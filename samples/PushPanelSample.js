enyo.kind({
	name: "moon.sample.PushPanelSample",
	kind: "moon.Panels",
	pattern: "activity",
	popOnBack: true,
	classes: "moon enyo-fit",
	components: [
		{kind: "moon.Panel", title:"Data Grid List", headerComponents: [
			{kind: "moon.Button", content:"Push Panel", ontap:"addPanel"}
		], components: [
			{name: "gridList1", renderDelay: 0, fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
				{ kind: "moon.sample.GridSampleItem" }
			]}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.gridList1.collection"},
		{from: ".collection", to: ".$.gridList2.collection"}
	],
	create: function () {
		this.inherited(arguments);
		// we set the collection that will fire the binding and add it to the list
		this.set("collection", new enyo.Collection(this.generateRecords()));
	},
	generateRecords: function () {
		var records = [],
			idx     = this.indexCache || 0;
		for (; records.length < 500; ++idx) {
			var title = (idx % 8 === 0) ? " with long title" : "";
			var subTitle = (idx % 8 === 0) ? "Lorem ipsum dolor sit amet" : "Subtitle";
			records.push({
				text: "Item " + idx + title,
				subText: subTitle,
				url: "http://placehold.it/300x300/" + Math.floor(Math.random()*0x1000000).toString(16) + "/ffffff&text=Image " + idx
			});
		}
		// update our internal indexCache so it will always generate unique values
		this.indexCache = idx;
		return records;
	},
	addPanel: function() {
		this.pushPanel(
			{kind: "moon.Panel", deferRender: true, title:"Data Grid List", headerComponents: [
				{kind: "moon.Button", content: "back", ontap: "back"}
			], components: [
				{name: "gridList2", renderDelay: 0, fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", scrollerOptions: { kind: "moon.Scroller", vertical:"scroll", horizontal: "hidden", spotlightPagingControls: true }, components: [
					{ kind: "moon.sample.GridSampleItem" }
				]}
			]}
		);
	},
	back: function(inSender, inEvent) {
		this.previous();
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