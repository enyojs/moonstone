enyo.kind({
	name: "moon.sample.wizard.ConfirmPageSample",
	kind: "Sample.Wizard.Panel",
	components: [
		{classes: "wizard-nav-button-container", components: [
			{name: "prev", kind: "moon.Button", classes: "wizard-button-top", ontap: "doPrevious", content: "Previous"},
			{name: "post", kind: "moon.Button", classes: "wizard-button-top", ontap: "doneTap", content: "Done"}
		]},
		
		{kind: "FittableRows", fit: true, components: [
			{name: "headline", classes: "wizard-instruction"},
			{kind: "moon.Scroller", fit: true, components: [
				{name: "resultList", kind: "enyo.DataRepeater", classes: "wizard-datalist-wrapper", components: [
					{classes: "wizard-datalist", components: [
						{style: "display: inline-block", bindings: [{from: ".model.step", to: ".content"}]},
						{style: "display: inline-block", bindings: [{from: ".model.result", to: ".content"}]},
						{style: "display: inline-block", bindings: [{from: ".model.processed", to: ".content"}]}
					]}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".controller.title", to: ".title"},
		{from: ".controller.wizResults", to: ".$.resultList.controller"}
	],
	initialSetting: function() {
		var idx = this.$.header.getTitleAbove()-1;
		var collection = this.controller.get("wizContainer");
		this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
		this.$.headline.set("content", collection.at(idx).get("instruction"));
	},
	doneTap: function(inSender, inEvent) {
		this.log("Done");
	}
});
