enyo.kind({
	name: "moon.sample.wizard.ConfirmPageSample",
	kind: "Sample.Wizard.Panel",
	components: [
		{classes: "wizard-nav-button-container moon-hspacing", components: [
			{name: "prev", kind: "moon.Button", ontap: "doPrevious", content: "Previous"},
			{name: "post", kind: "moon.Button", ontap: "doneTap", content: "Done"}
		]},
		
		{kind: "FittableRows", fit: true, components: [
			{name: "headline", classes: "wizard-instruction"},
			{kind: "moon.Scroller", fit: true, components: [
				{name: "resultList", kind: "enyo.DataRepeater", classes: "wizard-datalist-wrapper", components: [
					{
						classes: "wizard-datalist", 
						bindings: [
							{from: ".model.step", to: ".$.listItemText1.content"},
							{from: ".model.result", to: ".$.listItemText2.content"},
							{from: ".model.processed", to: ".$.listItemText3.content"}
						],
						components: [
							{name: "listItemText1", style: "display: inline-block"},
							{name: "listItemText2", style: "display: inline-block"},
							{name: "listItemText3", style: "display: inline-block"}
						]
					}
				]}
			]}
		]}
	],
	bindings: [
		{from: ".controller.title", to: ".title"},
		{from: ".controller.wizResults", to: ".$.resultList.controller"}
	],
	initialSetting: function() {
		var idx = this.indexInContainer();
		var collection = this.controller.get("wizContainer");
		this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
		this.$.headline.set("content", collection.at(idx).get("instruction"));
	},
	doneTap: function(inSender, inEvent) {
		this.log("Done");
	}
});
