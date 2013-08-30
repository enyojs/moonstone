enyo.kind({
	name: "moon.sample.InputHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-header-sample",
	handlers: {
		onInputHeaderInput: "handleInput",
		onInputHeaderChange: "handleChange"
	},
	components: [
		{
			kind: "moon.Panel",
			headerOptions: {kind: "moon.InputHeader", components: [
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../patterns-samples/assets/icon-next.png"}
			]},
			title:"Input Header",
			titleAbove: "02",
			titleBelow: "Sub Header",
			subTitleBelow: "Sub-sub Header"
		},
		{kind: "moon.Divider", content: "Result", classes: "moon-input-header-sample-result"},
		{name: "console", classes: "moon-input-header-sample-console", content: "Input: "}
	],
	handleInput: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inEvent.originator.getValue());
	},
	handleChange: function(inSender, inEvent) {
		this.$.console.setContent("Change: " + inEvent.originator.getValue());
	}
});
