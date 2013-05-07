enyo.kind({
	name: "moon.sample.ItemSample",
	classes: "moon enyo-unselectable",
	layoutKind: "enyo.FittableColumnsLayout",
	components: [
		{kind: "enyo.Spotlight"},
		{
			fit: true,
			style: "padding: 20px",
			components: [
				{kind: "moon.Divider", content: "Items"},
				{
					components: [
						{kind: "moon.Item", content: "Item 1", spotlight: true},
						{kind: "moon.Item", content: "Item 2", spotlight: true},
						{kind: "moon.Item", content: "Item 3", spotlight: true},
						{kind: "moon.Item", content: "Item 4", spotlight: true}
					]
				}
			]
		}
	]
});