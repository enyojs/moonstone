enyo.kind({
	name: "moon.sample.ExpandableInputSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
			{classes: "moon-6h", components: [
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "ExpandableInput"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "ExpandableInput",
				placeholder: "Placeholder"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "ExpandableInput",
				placeholder: "Placeholder", value: "Text"},
				{kind: "moon.ExpandableInput", onChange:"inputChanged", content: "ExpandableInput",
				disabled:true, value: "Disabled Input"},
				{name: "console", classes: "moon-input-sample-console", content: "Input: "},
			]}
		]}
	],
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent("Input: " + inSender.getValue());
	}
});
