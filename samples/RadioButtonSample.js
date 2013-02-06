enyo.kind({
	name: "moon.sample.RadioButtonSample",
	classes: "moon-radio-button-sample enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{tag:"h3", content:"Radio Buttons"},
		{name: "testSelectButton", kind: "moon.RadioButtonGroup", onActivate: "buttonActivated", components: [
			{content: "Cat"},
			{content: "Dog"},
			{content: "Hippopotamus"}
		]},
		{tag: "br"},{tag: "br"},{tag: "br"},
		{tag:"h3", content:"Disabled Radio Buttons"},
		{name: "disabledButton", kind: "moon.RadioButtonGroup", disabled: true, onActivate: "buttonActivated", components: [
			{content: "Whale", disabled: true},
			{content: "Shark"},
			{content: "Dolhpin"}
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