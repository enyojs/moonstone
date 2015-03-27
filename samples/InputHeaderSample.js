enyo.kind({
	name: "moon.sample.InputHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-header-sample",
	components: [
		{kind:"moon.Panels", pattern:"none", fit:true, components: [
			{
				kind: "moon.Panel",
				headerOptions: {kind: "moon.InputHeader", components: [
					{kind: "moon.IconButton", icon: "check"},
					{kind: "moon.IconButton", icon: "arrowlargeright"}
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
				headerOptions: {kind: "moon.InputHeader", components: [
					{kind: "moon.IconButton", icon: "check"},
					{kind: "moon.IconButton", icon: "arrowlargeright"}
				]},
				onInputHeaderInput: "handleInput",
				onInputHeaderChange: "handleChange",
				headerType: "medium",
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
		return true;
	},
	handleChange: function(inSender, inEvent) {
		this.$.console.setContent("Change: " + inEvent.originator.getValue());
		return true;
	}
});
