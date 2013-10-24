enyo.kind({
	name: "moon.sample.wizard.IntroPageSample",
	kind: "Sample.Wizard.Panel",
	layoutKind: "FittableRowsLayout",
	components: [
		{fit: true, kind: "moon.Scroller", horizontal: "hidden", components: [
			{components: [
				{classes: "wizard-input-description"},
				{classes: "wizard-nav-button-container moon-hspacing", components: [
					{name: "next", kind: "moon.Button", ontap: "doNext", content: "Next"}
				]}
			]},
			{layoutKind: "FittableColumnsLayout", components: [
				{name: "imgmenu", kind: "enyo.Image", classes: "wizard-intro-image"},
				{components: [
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
