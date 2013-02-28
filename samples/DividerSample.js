enyo.kind({
	name: "moon.sample.DividerSample",
	classes: "moon enyo-unselectable",
	fit: true,
	style: "padding: 20px;",
	components: [
		{kind: "moon.Divider", content: "Divider 1"},
		{kind: "moon.Item", content: "Item 1"},
		{kind: "moon.Item", content: "Item 2"},
		{kind: "moon.Item", content: "Item 3"},
		{kind: "moon.Item", content: "Item 4"}
	]
});