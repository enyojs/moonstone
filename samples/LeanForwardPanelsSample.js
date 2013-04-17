enyo.kind({
	name: "moon.sample.LeanForwardPanelsSample",
	kind: "FittableRows",
	components: [
		{kind: "moon.Button", content: "Next", ontap: "next"},
		{kind: "moon.Button", content: "Prev", ontap: "prev"},
		{name: "panels", kind: "moon.LeanForwardPanels", fit: true, classes: "sample-panels", components: [
			{content: "01", classes: "sample-panel sample-panel-1"},
			{content: "02", classes: "sample-panel sample-panel-2"},
			{content: "03", joinToPrev: true, classes: "sample-panel sample-panel-3"},
			{content: "04", joinToPrev: true, classes: "sample-panel sample-panel-4"},
			{content: "05", classes: "sample-panel sample-panel-5"},
			{content: "06", classes: "sample-panel sample-panel-6"},
			{content: "07", joinToPrev: true, classes: "sample-panel sample-panel-7"}
		]}
	],
	next: function() {
		this.$.panels.next();
	},
	prev: function() {
		this.$.panels.previous();
	}
});

enyo.kind({
	name: "moon.LeanForwardPanels",
	kind: "moon.Panels",
	arrangerKind: "moon.LeanForwardArranger",
	indexChanged: function() {
		this.inherited(arguments);
		this.log(this.getIndex());
	}
});