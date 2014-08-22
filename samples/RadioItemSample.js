enyo.kind({
	name: "moon.sample.RadioItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "FittableRows",
	components: [
		{fit:true, components: [
			{kind: "moon.Divider", content:"Radio Items"},
			{style: "margin: 0 10px", onActivate: "buttonActivated", components: [
				{kind: "moon.RadioItem", content: "Cat"},
				{kind: "moon.RadioItem", content: "Dog"},
				{kind: "moon.RadioItem", content: "Whale", disabled: true},
				{kind: "moon.RadioItem", content: "Monte Verde Golden Toad"}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content:"Radio Item Group"},
			{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
				{content: "Raspberry"},
				{content: "Blackberry"},
				{content: "Strawberry", disabled: true},
				{content: "Persimmon is botanical berries"}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content:"Pre-selected Radio Item Group"},
			{kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
				{content: "Creek"},
				{content: "River", selected: true},
				{content: "Waterfall", disabled: true},
				{content: "Ocean is big big big water"}
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