enyo.kind({
	name: "moon.sample.RadioItemSample",
	classes: "moon-radio-item-sample enyo-unselectable",
	fit: true,
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content:"Radio Items"},
		{name: "testSelectButton", kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
			{content: "Cat"},
			{content: "Dog"},
			{content: "Hippopotamus"}
		]},
		{tag: "br"},{tag: "br"},{tag: "br"},
		{kind: "moon.Divider", content:"Disabled Radio Items"},
		{name: "disabledButton", kind: "moon.RadioItemGroup", disabled: true, onActivate: "buttonActivated", components: [
			{content: "Whale", disabled: true},
			{content: "Shark"},
			{content: "Dolphin"}
		]},
		{name: "result", classes: "moon-sample-result", content: "result"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.result.setContent("");
	},
	buttonActivated: function(inSender, inEvent) {
		if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioItem")) {
			this.$.result.setContent("The \"" + inEvent.originator.getContent() + "\" button is selected.");
		} else {
			this.$.result.setContent("The \"" + inEvent.originator.name + "\" button is selected.");
		}
	}
});