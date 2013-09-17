enyo.kind({
	name: "moon.sample.DividerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{classes:"moon-4h", components: [
			{kind: "moon.Divider", content: "Divider 1"},
			{kind: "moon.Item", content: "Item 1"},
			{kind: "moon.Item", content: "Item 2"},
			{kind: "moon.Item", content: "Item 3"},
			{kind: "moon.Item", content: "Item 4"},

			{classes:"moon-1v"}, // Spacer

			{kind: "moon.Divider", content: "Divider 2"},
			{kind: "moon.Item", content: "Item 1"},
			{kind: "moon.Item", content: "Item 2"},

			{classes:"moon-1v"}, // Spacer

			{kind: "moon.Divider", content: "Very Long Divider with truncation"},
			{kind: "moon.Item", content: "Item 1"},
			{kind: "moon.Item", content: "Item 2"}
		]}
	]
});