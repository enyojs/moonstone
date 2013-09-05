enyo.kind({
	name: "moon.sample.wizard.StepPageSample",
	kind: "Sample.Wizard.Panel",
	layoutKind: "FittableRowsLayout",
	handlers: {
		onchange: "inputChanged"
	},
	components: [
		{classes: "wizard-nav-button-container", style: "position:absolute; top:0; right:0;", components: [
			{name: "prev", kind: "moon.Button", classes: "wizard-button-top", ontap: "doPrevious", content: "Previous"},
			{name: "post", kind: "moon.Button", classes: "wizard-button-top", ontap: "goNext", content: "Next"}
		]},

		{fit: true, components: [
			{name: "headline", classes: "wizard-input-description"},

			{classes: "wizard-block-row", components: [
				{name: "indeco1", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
					{name: "intext1", kind: "moon.Input", placeholder: "INPUT FIELD 01"}
				]},
				{name: "check1", kind: "moon.CheckboxItem", classes: "wizard-check-inline", content: "OPTION 1"},
				{name: "check2", kind: "moon.CheckboxItem", classes: "wizard-check-inline",content: "OPTION 2"}
			]},

			{classes: "wizard-block-row", components: [
				{name: "indeco2", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
					{name: "intext2", kind: "moon.Input", placeholder: "INPUT FIELD 02"}
				]}
			]},

			{name: "detail", classes: "wizard-input-description"},

			{classes: "wizard-block-row", components: [
				{name: "indeco3", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
					{name: "intext3", kind: "moon.Input", placeholder: "INPUT FIELD 03"}
				]}
			]},

			{classes: "wizard-block-row", components: [
				{name: "indeco4", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
					{name: "intext4", kind: "moon.Input", placeholder: "INPUT FIELD 04"}
				]}
			]}
		]},
		
		{name: "cancel", kind: "moon.Button", small: true, classes: "wizard-button-bottom", ontap: "doCancel", content: "Cancel"}
	],
	initialSetting: function() {
		var idx = this.indexInContainer();
		var collection = this.controller.get("wizContainer");

		this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
		this.$.headline.set("content", collection.at(idx).get("instruction"));
		this.$.detail.set("content", collection.at(idx).get("detail"));
	},
	goNext: function(inSender, inEvent) {
		var idx = this.indexInContainer();
		var collection = this.controller.get("wizResults");
		this.setProcessed(true);
		collection.at(idx).set("result", this.getSelectedText());
		collection.at(idx).set("processed", "[TRUE]");
		this.doNext();
		return true;
	},
	inputChanged: function(inSender, inEvent) {
		var result1 = this.$.intext1.getValue();
		var result2 = this.$.check1.getChecked();
		var result3 = this.$.check2.getChecked();
		var result4 = this.$.intext2.getValue();
		var result5 = this.$.intext3.getValue();
		var result6 = this.$.intext4.getValue();
		var result = result1 + ", ";
		result += result2 + ", ";
		result += result3 + ", ";
		result += result4 + ", ";
		result += result5 + ", ";
		result += result6;
		this.setSelectedText(result);
		return true;
	}
});
