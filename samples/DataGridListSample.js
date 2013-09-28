enyo.kind({
	name: "moon.sample.DataGridListSample",
	classes: "moon enyo-fit",
	components: [
		{name: "gridList", spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", components: [
			{
				kind: "moon.GridListImageItem",
				subCaption: "Sub Caption",
				source: "./assets/default-music.png",
				bindings: [
					{from: ".model.text", to: ".caption"}
				]
			}
		]}
	],
	create: function () {
		this.inherited(arguments);
		for (var i=0, c=new enyo.Collection(); i<500; ++i) { c.add({text: "Item " + i}); }
		this.$.gridList.set("controller", c);
	}
});
