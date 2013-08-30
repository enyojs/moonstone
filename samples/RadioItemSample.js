enyo.kind({
	name: "moon.sample.RadioItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content:"Radio Items"},
		{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
			{content: "Cat"},
			{content: "Dog"},
			{content: "Whale", disabled: true},
			{content: "Monte Verde Golden Toad"}
		]},
		{name: "result", classes: "moon-sample-result", content: "result"}
	],
	rendered: function() {
		this.inherited(arguments);
		this.$.result.setContent("");
	},
	buttonActivated: function(inSender, inEvent) {
		var originator = inEvent.originator,
			str = 'The "';
		
		if (!originator || !this.hasNode()) {
			return;
		}
			
		str += (inEvent.originator.getActive() && inEvent.originator.kind === "moon.RadioItem") ? originator.getContent() : originator.name;
		str +=  '" item is selected.';
		
		this.$.result.setContent(str);
	}
});