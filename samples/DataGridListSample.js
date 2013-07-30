enyo.kind({
	name: "moon.sample.DataGridListSample",
	classes: "moon enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{name: "gridList", spacing: 20, minWidth: 180, minHeight: 240, kind: "moon.DataGridList", components: [
			{
				kind: "moon.GridListImageItem",
				subCaption: "Sub Caption",
				source: "./assets/default-music.png",
				bindFrom: ".text",
				bindTo: ".caption"
			}
		]}
	],
	create: function () {
		this.inherited(arguments);
		var c = new enyo.Collection();
		for (var $i=0, r$=[]; r$.length<500; ++$i) {
			r$.push({text: "Item " + $i});
		}
		c.add(r$);
		this.$.gridList.set("controller", c);
	}	
});
