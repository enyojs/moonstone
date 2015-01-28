enyo.kind({
	name: "moon.sample.ItemOverlaySample",
	classes: "moon enyo-unselectable enyo-fit moon-item-overlay-sample-wrapper",
	components: [
		{kind: "moon.Scroller", classes: "enyo-fill moon-7h", components: [
			{kind: "moon.Divider", content: "Simple ItemOverlay Sample"},
			{components: [
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], beginningComponents: [
						{kind: "moon.Icon", icon: "search", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Item with icon on the left side"}
					]
				},
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], endingComponents: [
						{kind: "moon.Icon", icon: "check", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Item with icon on the right side"}
					]
				}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "ItemOverlay with multiple icons Sample"},
			{components: [
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], beginningComponents: [
						{kind: "moon.Icon", icon: "arrowlargeup", small: true},
						{kind: "moon.Icon", icon: "arrowlargedown", small: true},
						{kind: "moon.Icon", icon: "arrowlargeleft", small: true},
						{kind: "moon.Icon", icon: "arrowlargeright", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Multiple Icons can be used"}
					]
				},
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], endingComponents: [
						{kind: "moon.Icon", icon: "arrowlargeup", small: true},
						{kind: "moon.Icon", icon: "arrowlargedown", small: true},
						{kind: "moon.Icon", icon: "arrowlargeleft", small: true},
						{kind: "moon.Icon", icon: "arrowlargeright", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Multiple Icons can be used"}
					]
				},
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], beginningComponents: [
						{kind: "moon.Icon", icon: "arrowextend", small: true}
					], endingComponents: [
						{kind: "moon.Icon", icon: "arrowshrink", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Use left and right overlay at the same time"}
					]
				}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "ItemOverlay Auto Hide Sample"},
			{components: [
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], autoHideBeginning: true, beginningComponents: [
						{kind: "moon.Icon", src: "$lib/moonstone/samples/assets/icon-list.png", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "These text are flow when item is getting focused"}
					]
				},
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], autoHideEnding: true, endingComponents: [
						{kind: "moon.Icon", src: "$lib/moonstone/samples/assets/icon-album.png", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "These text are flow when item is getting focused"}
					]
				}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Combine both autoHide true and false"},
			{components: [
				{kind: "moon.Item", mixins: ["moon.ItemOverlaySupport"], autoHideEnding: true, beginningComponents: [
						{kind: "moon.Icon", icon: "search", small: true}
					], endingComponents: [
						{kind: "moon.Icon", icon: "backward", small: true},
						{kind: "moon.Icon", icon: "play", small: true},
						{kind: "moon.Icon", icon: "forward", small: true}
					], components: [
						{kind: "moon.MarqueeText", content: "Both static and autoHiding ItemOverlays"}
					]
				}
			]}
		]}
	]
});