enyo.kind({
	name: "moon.sample.InputHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-header-sample",
	components: [
		{kind:"moon.Panels", pattern:"none", fit:true, components: [
			{
				kind: "moon.Panel",
				classes: "moon-10h",
				headerOptions: {kind: "moon.InputHeader", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]},
				onInputHeaderInput: "handleInput",
				onInputHeaderChange: "handleChange",
				title:"Input Header",
				titleAbove: "01",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header"
			},
			{
				kind: "moon.Panel",
				classes: "moon-8h",
				joinToPrev: true,
				headerOptions: {kind: "moon.InputHeader", components: [
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
				]},
				onInputHeaderInput: "handleInput",
				onInputHeaderChange: "handleChange",
				headerType: "small",
				title:"Small Input Header",
				titleAbove: "02",
				titleBelow: "Sub Header",
				subTitleBelow: "Sub-sub Header"
			}
		]},
		{kind: "moon.Divider", content: "Result", classes: "moon-input-header-sample-result"},
		{kind: "moon.BodyText", name: "console", content: "Input: "}
	],
	handleInput: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inEvent.originator.getValue());
	},
	handleChange: function(inSender, inEvent) {
		this.$.console.setContent("Change: " + inEvent.originator.getValue());
	}
});
