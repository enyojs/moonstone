enyo.kind({
	name: "moon.sample.SelectableItemSample",
	classes: "moon enyo-unselectable",
	layoutKind: "enyo.FittableColumnsLayout",
	components: [
		{kind: "enyo.Spotlight"},
		{	
			fit: true,
			style: "padding: 20px",
			components: [
				{kind: "moon.Divider", content: "SelectableItems witout Group"},
				{
					components: [
						{kind: "moon.SelectableItem", content: "Item 1", spotlight: true},
						{kind: "moon.SelectableItem", content: "Item 2", spotlight: true},
						{kind: "moon.SelectableItem", content: "Item 3", spotlight: true},
						{kind: "moon.SelectableItem", content: "Item 4", spotlight: true}
					]
				},
				{kind: "moon.Divider", content: "SelectableItem with Group"},
				{kind: "Group", components: [
					{kind: "moon.SelectableItem", content: "Option 1"},
					{kind: "moon.SelectableItem", content: "Option 2", checked: true},
					{kind: "moon.SelectableItem", disabled: true, content: "Disabled"},
					{kind: "moon.SelectableItem", content: "Option 4"},
					{kind: "moon.SelectableItem", content: "Option 5"}
				]}
			]
		}
	]
});