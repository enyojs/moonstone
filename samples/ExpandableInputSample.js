enyo.kind({
	name: "moon.sample.ExpandableInputSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
			{classes: "moon-6h", components: [
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input", noneText: "No Input"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input with Placeholder", noneText: "No Input", placeholder: "Placeholder"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input with Value", noneText: "No Input", placeholder: "Placeholder", value: "Text"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Disabled Input", noneText: "No Input", disabled:true, value: "I am disabled."},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input with loooooooooooooooong text truncation", noneText: "No Input with loooooooooooooooooong text truncation"},
				{name: "console", classes: "moon-input-sample-console", content: "Input:"},
			]}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
