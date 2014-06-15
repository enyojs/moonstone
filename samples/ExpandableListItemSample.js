enyo.kind({
	name: "moon.sample.ExpandableListItemSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onActivate: "activateHandler"
	},
	components: [
		{kind: "moon.Scroller", horizontal: "hidden", fit: true, components: [
			{classes:"moon-5h", components: [
				{kind: "moon.ExpandableListItem", content: "Expandable ListItem", components: [
					{content: "Item 1"},
					{content: "Item 2"},
					{content: "Item 3"}
				]},
				{kind: "moon.ExpandableListItem", disabled:true, content:"Disabled ListItem", components: [
					{content: "Item 1"},
					{content: "Item 2"},
					{content: "Item 3"}
				]},
				{kind: "moon.ExpandableListItem", content: "Pre-expanded ListItem", open: true, components: [
					{content: "Item 1"},
					{content: "Item 2"},
					{content: "Item 3"}
				]},
				{kind: "moon.ExpandableListItem", content: "Bottom-locking", lockBottom: true, open: true, components: [
					{content: "Item 1"},
					{content: "Item 2"},
					{content: "Item 3"}
				]},
				{kind: "moon.ExpandableListItem", content: "Auto-collapsing", autoCollapse: true, components: [
					{content: "Item 1"},
					{content: "Item 2"},
					{content: "Item 3"}
				]},
				{kind: "enyo.Group", highlander: true, components: [
					{kind: "moon.ExpandableListItem",  open: true,
						content: "This is a grouped ExpandableListItem", components: [
							{content: "Item One"},
							{content: "Item Two"}
						]
					},
					{kind: "moon.ExpandableListItem",
						content: "This is another grouped ExpandableListItem", components: [
							{content: "Item Three"},
							{content: "Item Four"}
						]
					},
					{kind: "moon.ExpandableListItem",
						content: "This is yet another grouped ExpandableListItem", components: [
							{content: "Item Five"},
							{content: "Item Six"}
						]
					}
				]}
			]}
		]},
		{kind: "moon.Divider", content:"Result"},
		{kind: "moon.BodyText", name: "console", content: "Event"}
	],
	activateHandler: function(inSender, inEvent) {
		if (this.generated && inEvent.originator instanceof moon.ExpandableListItem) {
			this.$.console.setContent(inEvent.originator.getContent() + " is now " + (inEvent.originator.getActive() ? "open" : "closed"));
		}
	}
});
