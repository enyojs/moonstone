enyo.kind({
	name: "moon.sample.RadioItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "FittableRows",
	components: [
		{fit:true, components: [
			{kind: "moon.Divider", content:"Radio Items"},
			{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
				{content: "Cat"},
				{content: "Dog"},
				{content: "Whale", disabled: true},
				{content: "Monte Verde Golden Toad"}
			]}
		]},
		{kind: "moon.Divider", content:"Result"},
		{kind: "moon.BodyText", name: "result", content: "No action yet."}
	],
	rendered: function() {
		this.inherited(arguments);
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