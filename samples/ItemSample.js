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
			},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "ItemOverlay Sample"},
			{
				components: [
					{kind: "moon.Item", components: [
						{kind: "moon.ItemOverlay", autoHide: true, right: true, components:[
							{kind: "moon.Icon", icon: "arrowlargeup", small: true},
							{kind: "moon.Icon", icon: "arrowlargedown", small: true},
							{kind: "moon.Icon", icon: "arrowlargeleft", small: true},
							{kind: "moon.Icon", icon: "arrowlargeright", small: true}
						]},
						{kind: "moon.MarqueeText", content: "Item   with   icons   auto   hides"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.ItemOverlay", autoHide: false, right: true, components:[
							{kind: "moon.Icon", icon: "arrowlargeup", small: true},
							{kind: "moon.Icon", icon: "arrowlargedown", small: true},
							{kind: "moon.Icon", icon: "arrowlargeleft", small: true},
							{kind: "moon.Icon", icon: "arrowlargeright", small: true}
						]},
						{kind: "moon.MarqueeText", content: "Item   with   icons   on   right   side"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.ItemOverlay", autoHide: false, right: false, components:[
							{kind: "moon.Icon", icon: "arrowlargeup", small: true},
							{kind: "moon.Icon", icon: "arrowlargedown", small: true},
							{kind: "moon.Icon", icon: "arrowlargeleft", small: true},
							{kind: "moon.Icon", icon: "arrowlargeright", small: true}
						]},
						{kind: "moon.MarqueeText", content: "Item   with   icons   on   left   side"}
					]},
					{kind: "moon.Item", components: [
						{kind: "moon.ItemOverlay", autoHide: false, right: false, components:[
							{kind: "moon.Icon", icon: "arrowlargeup", small: true}
						]},
						{kind: "moon.ItemOverlay", autoHide: false, right: true, components:[
							{kind: "moon.Icon", icon: "arrowlargedown", small: true}
						]},
						{kind: "moon.MarqueeText", content: "Item   with   icons   on   both   sides"}
					]}
				]
			}
		]}
	]
});