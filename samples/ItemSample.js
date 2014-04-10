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
					{kind: "moon.Item", content: "Item   with   extra   spaces   that   should   truncate"},
					{kind: "moon.Item", components: [
						{kind: "moon.Icon", icon: "drawer"},
						{tag: "span", content: "Item with components"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.MarqueeText", content: "Item with more complex components"},
						{kind: "moon.Image", src: "http://placehold.it/440x80&text=Image+One", alt: "Image One"},
						{kind: "moon.Image", src: "http://placehold.it/440x80&text=Image+Two", alt: "Image Two"}
					]}
				]
			}
		]}
	]
});