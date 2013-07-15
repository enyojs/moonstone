enyo.kind({
	name: "moon.sample.wizard.IntroPageSample",
	kind: "Sample.Wizard.Panel",
	layoutKind: "FittableRowsLayout",
	components: [
		{classes: "wizard-nav-button-container", components: [
			{kind: "moon.Button", classes: "wizard-button-top", ontap: "doNext", content: "Next"}
		]},

		{fit:true, kind: "FittableColumns", components: [
			{name: "imgmenu", kind: "enyo.Image", style:"width:480px;height:320px;padding-right:30px"},
			{fit: true, components: [
				{name: "headline", classes: "wizard-instruction"},
				{name: "detail", classes: "wizard-instruction-detail"}
			]}
		]},

		{kind: "moon.Button", classes: "wizard-button-bottom", ontap: "doCancel", content: "Cancel"}
	],
	initialSetting: function() {
		var idx = this.$.header.getTitleAbove()-1;
		var collection = this.controller.get("wizContainer");

		this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
		this.$.imgmenu.set("src", collection.at(idx).get("imgsrc"));
		this.$.headline.set("content", collection.at(idx).get("instruction"));
		this.$.detail.set("content", collection.at(idx).get("detail"));
	},
});
