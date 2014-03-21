enyo.kind({
	name: "moon.sample.ItemSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{classes:"moon-6h", components: [
			{kind: "moon.Divider", content: "Item Sample"},
			{
				components: [
					{kind: "moon.Item", content: "Item 1"},
					{kind: "moon.Item", content: "Item 2 (Disabled)", disabled:true},
					{kind: "moon.Item", content: "Item 3"},
					{kind: "moon.Item", content: "Item with very long text that should truncate"},
					{kind: "moon.Item", content: "Item   with   extra   spaces   that   should   truncate"}
				]
			}
		]}
	]
});