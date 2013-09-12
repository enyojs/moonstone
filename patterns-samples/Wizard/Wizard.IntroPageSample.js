enyo.kind({
	name: "moon.sample.wizard.IntroPageSample",
	kind: "Sample.Wizard.Panel",
	layoutKind: "FittableRowsLayout",
	components: [
		{classes: "wizard-nav-button-container moon-hspacing", components: [
			{name: "next", kind: "moon.Button", ontap: "doNext", content: "Next"}
		]},
		{fit:true, kind: "moon.Scroller", components: [
			{layoutKind: "FittableColumnsLayout", components: [
				{name: "imgmenu", kind: "enyo.Image", classes: "wizard-intro-image"},
				{fit: true, components: [
					{name: "headline", classes: "wizard-instruction"},
					{name: "detail", classes: "wizard-instruction-detail"}
				]}
			]}
		]},

		{kind: "moon.Button", classes: "wizard-button-bottom", small: true, ontap: "doCancel", content: "Cancel"}
	],
	initialSetting: function() {
		var idx = this.indexInContainer();
		var collection = this.controller.get('wizContainer');

		this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
		this.$.imgmenu.set("src", collection.at(idx).get("imgsrc"));
		this.$.headline.set("content", collection.at(idx).get("instruction"));
		this.$.detail.set("content", collection.at(idx).get("detail"));
	}
});
