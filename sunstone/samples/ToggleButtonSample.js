enyo.kind({
	name: "sun.sample.ToggleButtonSample",
	classes: "moon moon-sample",
	components: [
		{classes: "moon-sample-divider", content: "Toggle Buttons"},
		{classes: "moon-sample-tools", components: [
			{name: "The 1st toggle button", kind:"sun.ToggleButton", onChange:"toggleChanged", value: true},
			{name: "The 2nd toggle button", kind:"sun.ToggleButton", onChange:"toggleChanged", value: false},
			{kind:"sun.ToggleButton", onChange:"toggleChanged", value: true, disabled: true},
			{kind:"sun.ToggleButton", onChange:"toggleChanged", value: false, disabled: true}
		]},
		{tag: "br"},
		{classes: "moon-sample-divider", content: "Toggle Buttons Group"},
		{kind: "Group", classes: "moon-sample-tools group", onActivate:"groupActivated", highlander: true, components: [
			{kind:"sun.ToggleButton"},
			{kind:"sun.ToggleButton", value: true},
			{kind:"sun.ToggleButton"}
		]},
		{tag: "br"},
		{tag: "br"},
		{name: "result"}
	],
	toggleChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + " was " + (inSender.getValue() ? " selected." : "deselected."));
	},
	ordinals: ["1st", "2nd", "3rd"],
	groupActivated: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.indexInContainer();
			this.$.result.setContent("The " + this.ordinals[selected] + " toggle button in the group is selected.");
		}
	}
});
