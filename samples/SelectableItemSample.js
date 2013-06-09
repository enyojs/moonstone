enyo.kind({
	name: "moon.sample.SelectableItemSample",
	kind:"FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, components: [
			{classes: "moon-hspacing", controlClasses:"moon-4h", components: [
				{components: [
					{kind: "moon.Divider", content: "Selectable Items"},
					{kind: "moon.SelectableItem", content: "Option 1", checked: true, onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 2", onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", disabled: true, content: "Disabled", onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 4", checked: true, onActivate: "itemChanged"},
					{kind: "moon.SelectableItem", content: "Option 5", onActivate: "itemChanged"}
				]},
				{components: [
					{kind: "moon.Divider", content: "Selectable Item Group"},
					{kind: "Group", onActivate: "groupChanged", components: [
						{kind: "moon.SelectableItem", content: "Group Option 1"},
						{kind: "moon.SelectableItem", content: "Group Option 2", checked: true},
						{kind: "moon.SelectableItem", disabled: true, content: "Disabled"},
						{kind: "moon.SelectableItem", content: "Group Option 4"},
						{kind: "moon.SelectableItem", content: "Group Option 5"}
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
		this.$.result.setContent(inSender.getContent() + " was " + (inSender.getActive() ? " selected." : "deselected."));
	},
	groupChanged: function(inSender, inEvent) {
		if (inEvent.originator.getActive()) {
			var selected = inEvent.originator.getContent();
			this.$.result.setContent(selected + " was selected.");
		}
	}
});
