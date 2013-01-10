enyo.kind({
	name: "moon.sample.ViewSelectButtonSample",
	classes: "moon-view-select-button-sample",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "testSelectButton", kind: "moon.ViewSelectButton", onActivate: "buttonActivated", components: [
			{content: "Cats"},
			{content: "Dogs"},
			{content: "This is a looooong button"}
		]},
		{name: "result", classes: "moon-sample-result", content: "result"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.result.setContent("");
	},
	buttonActivated: function(inSender, inEvent) {
		if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.ViewSelectButtonItem")) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" button is selected.");
		} else {
			this.$.result.setContent("The \"" + inEvent.originator.name + "\" button is selected.");
		}
	}
});