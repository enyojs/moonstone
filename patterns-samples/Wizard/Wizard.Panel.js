enyo.kind({
	name: "moon.Sample.Wizard.Panel",
	kind: "moon.Panel",
	autoNumber: false,
	events: {
		onPrevious: "",
		onNext: "",
		onCancel: ""
	},
	components: [
		{fit:true, kind: "moon.Scroller", horizontal: "hidden", components: [
			{layoutKind: "FittableColumnsLayout", components: [
				{name: "imgmenu", kind: "enyo.Image", classes: "moon-6h moon-8v"},
				{fit: true, components: [
					{name: "headline"},
					{name: "detail"}
				]}
			]}
		]},
		{kind: "moon.Button", ontap: "doCancel", content: "Cancel"}
	],
	headerComponents: [
		{name: "prev", kind: "moon.Button", ontap: "doPrevious", content: "Previous"},
		{name: "post", kind: "moon.Button", ontap: "doNext", content: "Next"}
	],
	bindings: [
		{from: ".controller.title", to: ".title"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.initialSetting();
	},
	initialSetting: function() {
		var idx = this.indexInContainer();
		var subTitleIdx;
		if (!idx) {
			this.$.prev.hide();
		}
		if (idx < 9) {
			subTitleIdx = "0" + (idx + 1);
		}
		var collection = this.controller.get('wizContainer');
		var record = collection.at(idx);

		this.$.header.setTitleBelow(subTitleIdx + ". " + record.get("subtitle"));
		this.$.imgmenu.set("src", record.get("imgsrc"));
		this.$.headline.set("content", record.get("instruction"));
		this.$.detail.set("content", record.get("detail"));
	},
	finalSetting: function() {
		this.$.post.setContent("DONE");
	}
});
