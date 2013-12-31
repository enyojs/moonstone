enyo.kind({
	name: "moon.Sample.Wizard.FullPanel",
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
		{from: ".controller.title", to: ".title"},
		{from: ".controller.subTitle", to: ".subTitleBelow"},
		{from: ".controller.imgSrc", to: ".$.imgmenu.src"},
		{from: ".controller.instruction", to: ".$.headline.content"},
		{from: ".controller.detail", to: ".$.detail.content"}
	],
	setToIntro: function() {
		this.$.prev.hide();
	},
	setToEnd: function() {
		this.$.post.setContent("DONE");
	}
});
