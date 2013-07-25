enyo.kind({
	name: "MoonGridListSampleView",
	classes: "moon",
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
		], controller: ".app.controllers.items"}
	]
});

enyo.kind({
	name: "MoonGridListSample",
	kind: "enyo.Application",
	controllers: [
		{name: "items", kind: "enyo.Collection"}
	],
	view: "MoonGridListSampleView",
	start: function () {
		this.inherited(arguments);
		for (var $i=0, r$=[]; r$.length<500; ++$i) {
			r$.push({text: "Item " + $i});
		}
		this.controllers.items.add(r$);
	}
});

enyo.ready(function () {
	new MoonGridListSample({name: "app"});
});
