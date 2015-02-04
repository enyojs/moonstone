enyo.kind({
	name: "moon.sample.ItemSample",
	classes: "moon enyo-unselectable enyo-fit moon-item-sample-wrapper",
	components: [
		{kind: "moon.Scroller", classes: "enyo-fill moon-7h", components: [
			{kind: "moon.Divider", content: "Simple Item Samples"},
			{components: [
				{kind: "moon.Item", content: "Item 1"},
				{kind: "moon.Item", content: "Item 2 (Disabled)", disabled:true},
				{kind: "moon.Item", content: "Item 3 (Disabled) with really long marqueed text", disabled:true},
				{kind: "moon.Item", content: "Item 4"},
				{kind: "moon.Item", content: "Item with very long text that should truncate"},
				{kind: "moon.Item", content: "Item   with   extra   spaces   that   should   truncate"}
			]},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Complex Item Samples"},
			{components: [
				{kind: "moon.Item", components: [
					{kind: "moon.Icon", icon: "drawer"},
					{tag: "span", content: "Item with components"}
				]},
				{kind: "moon.Item", components: [
					{kind: "moon.MarqueeText", content: "Item with more complex components"},
					{kind: "moon.Image", src: {
						"hd" : "http://placehold.it/288x60&text=Image+One",
						"fhd": "http://placehold.it/432x90&text=Image+One"
					}, alt: "Image One"},
					{kind: "moon.Image", src: {
						"hd" : "http://placehold.it/288x60&text=Image+Two",
						"fhd": "http://placehold.it/432x90&text=Image+Two"
					}, alt: "Image Two"}
				]},
				{kind: "moon.Item", components: [
					{kind: "moon.MarqueeText", content: "Item with more complex components"},
					{kind: "moon.Image", src: {
						"hd" : "http://placehold.it/100x100&text=Image+Three",
						"fhd": "http://placehold.it/150x150&text=Image+Three"
					}, style: "float: left; margin: 10px 10px 10px 0", alt: "Image Two"},
					{kind: "moon.BodyText", style: "margin: 10px 0", content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."}
				]},
				{kind: "moon.Item", components: [
					{kind: "moon.MarqueeText", content: "Item with more complex components"},
					{kind: "moon.Image", src: {
						"hd" : "http://placehold.it/100x100&text=Image+Four",
						"fhd": "http://placehold.it/150x150&text=Image+Four"
					}, style: "float: right; margin: 10px 0px 10px 10px", alt: "Image Two"},
					{kind: "moon.BodyText", style: "margin: 10px 0", content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa."}
				]}
			]}
		]}
	]
});