enyo.kind({
	name: "moon.sample.DataGridListSample",
	classes: "moon enyo-fit",
	layoutKind: "FittableRowsLayout",
	components: [
		{kind : "moon.Button", content:"Refresh", ontap:"refreshItems"},
		{name: "gridList", fit: true, spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", components: [
			{
				kind: "moon.GridListImageItem",
				subCaption: "Sub Caption",
				bindings: [
					{from: ".model.text", to: ".caption"},
					{from: ".model.thumbnail", to: ".source"}
				]
			}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.gridList.collection"}
	],
	create: function () {
		this.inherited(arguments);
		// we set the collection that will fire the binding and add it to the list
		this.set("collection", new enyo.Collection(this.generateRecords()));
		this.$.gridList.getScroller().setScrollMultiplier(5);
	},
	generateRecords: function () {
		var records = [],
			idx     = this.index || 0;
		for (; records.length < 500; ++idx) {
			records.push({
				text: "Item " + idx,
				thumbnail: "http://placehold.it/186x186&text=Item+" + idx
			});
		}
		// update our internal index so it will always generate unique values
		this.index = idx;
		return records;
	},
	refreshItems: function () {
		// we fetch our collection reference
		var collection = this.get("collection");
		// we now remove all of the current records from the collection
		collection.removeAll();
		// and we insert all new records that will update the list
		collection.add(this.generateRecords());
	}
});