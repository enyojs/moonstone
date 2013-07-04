enyo.kind({
	name: "moon.sample.ExpandableInputSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
			{classes: "moon-7h", components: [
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input", noneText: "No Input"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input with Placeholder", noneText: "No Input", placeholder: "Placeholder"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Input with Value", noneText: "No Input", placeholder: "Placeholder", value: "Text"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "Disabled Input", noneText: "No Input", disabled:true, value: "I am disabled."},
				{name: "console", classes: "moon-input-sample-console", content: "Input:"},
			]}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
