enyo.kind({
	name: "moon.sample.ItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Item Sample"},
		{
			components: [
				{kind: "moon.Item", content: "Item 1"},
				{kind: "moon.Item", content: "Item 2"},
				{kind: "moon.Item", content: "Item 3"},
				{kind: "moon.Item", content: "Item 4"}
			]
		}
	]
});