enyo.kind({
	name: "sun.sample.InputHeaderSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit moon-input-header-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit: true, components: [
			{classes:"moon-hspacing", components: [
				{kind: "sun.InputHeader", title:"Input Header", titleAbove: "02", titleBelow: "Sub Header", 
				subTitleBelow: "Sub-sub Header", classes:"moon-10h", oninput:"handleInput", onchange:"handleChange", 
				components: [
					{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-like.png"},
					{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-next.png"}
				]},
				{kind: "sun.InputHeader", title: "Small Header", small: true, titleAbove: "02", titleBelow: "Sub Header", 
				subTitleBelow: "Sub-sub Header", classes:"moon-10h", oninput:"handleInput", onchange:"handleChange", 
				components: [
					{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-like.png"},
					{kind: "sun.IconButton", src: "$lib/moonstone/patterns-samples/assets/icon-next.png"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result", classes: "moon-input-header-sample-result"},
		{name: "console", classes: "moon-input-header-sample-console", content: "Input: "}
	],
	handleInput: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	},
	handleChange: function(inSender, inEvent) {
		this.$.console.setContent("Change: " + inSender.getValue());
	}
});
