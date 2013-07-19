enyo.kind({
	name: "moon.sample.DividerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Divider 1"},
		{kind: "moon.Item", content: "Item 1"},
		{kind: "moon.Item", content: "Item 2"},
		{kind: "moon.Item", content: "Item 3"},
		{kind: "moon.Item", content: "Item 4"},
		{kind: "moon.Divider", content: "Divider 2"},
		{kind: "moon.Item", content: "Item 1"},
		{kind: "moon.Item", content: "Item 2"},
		{kind: "moon.Divider", content: "Divider with truncation", style: "max-width: 200px;"},
		{kind: "moon.Item", content: "Item 1"},
		{kind: "moon.Item", content: "Item 2"}
	]
});