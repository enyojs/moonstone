enyo.kind({
	name: "moon.sample.SelectableItemSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-hspacing", controlClasses:"moon-5h", components: [
				{components: [
					{kind: "moon.Divider", content: "Selectable Items"},
					{kind: "moon.SelectableItem", content: "Option 1", selected: true, onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 2", onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", disabled: true, content: "Disabled", onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 4", selected: true, onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 5 is very very very long", onActivate: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Selectable Item Group"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.SelectableItem", content: "Group Option 1"},
						{kind: "moon.SelectableItem", content: "Group Option 2"},
						{kind: "moon.SelectableItem", disabled: true, content: "Disabled"},
						{kind: "moon.SelectableItem", content: "Group Option 4"},
						{kind: "moon.SelectableItem", content: "Group Option 5", selected: true}
					]}
				]},
				{components: [
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.Divider", content: "Selectable Items with long text truncation"},
						{kind: "moon.SelectableItem", content: "Option 1 with long text truncation", onActivate: "itemChanged"},
						{kind: "moon.SelectableItem", content: "Option 2 with long text truncation", onActivate: "itemChanged"},
						{kind: "moon.SelectableItem", disabled: true, content: "Disabled", onActivate: "itemChanged"},
						{kind: "moon.SelectableItem", content: "Option 4 with long text truncation", selected: true, onActivate: "itemChanged"},
						{kind: "moon.SelectableItem", content: "Option 5 with long text truncation", onActivate: "itemChanged"}
					]}
				]}
			]}
		]},
		{components: [
			{kind:"moon.Divider", content:"Result"},
			{name:"result", content:"Nothing selected"}
		]}
	],
	itemChanged: function(inSender, inEvent) {
		if (!this.hasNode()) {
			return;
		}
		this.$.result.setContent(inSender.getContent() + " was " + (inSender.getActive() ? " selected." : "deselected."));
	},
	groupChanged: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.getContent();
			this.$.result.setContent(selected + " was selected.");
		}
	}
});


		
