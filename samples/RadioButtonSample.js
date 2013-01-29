enyo.kind({
	name: "moon.sample.RadioButtonSample",
	classes: "moon-radio-button-sample enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{name: "testSelectButton", kind: "moon.RadioButtonGroup", onActivate: "buttonActivated", components: [
			{content: "Cat"},
			{content: "Dog"},
			{content: "Hippopotamus"}
		]},
		{name: "result", classes: "moon-sample-result", content: "result"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.result.setContent("");
	},
	buttonActivated: function(inSender, inEvent) {
		if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioButton")) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" button is selected.");
		} else {
			this.$.result.setContent("The \"" + inEvent.originator.name + "\" button is selected.");
		}
	}
});