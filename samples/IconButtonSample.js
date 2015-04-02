enyo.kind({
	name: "moon.sample.IconButtonSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{fit:true, components: [
				{kind: "moon.Divider", content: "Font-based Icon Buttons:"},
				{kind: "moon.IconButton", icon: "drawer", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", icon: "search", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", icon: "drawer", ontap: "buttonTapped"},
				{kind: "moon.IconButton", icon: "search", ontap: "buttonTapped"},
				{classes:"moon-1v"},
				{kind: "moon.Divider", content: "Image Asset Icon (Raster Image) Buttons:"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-list.png", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-album.png", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-list.png", ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-album.png", ontap: "buttonTapped"},
				{classes:"moon-1v"},
				{kind: "moon.Divider", content: "Image Asset Icons (Vector Image) Buttons:"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/magnify.svg", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/trash.svg", small: false, ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/magnify.svg", ontap: "buttonTapped"},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/trash.svg", ontap: "buttonTapped"},
				{classes:"moon-1v"},
				{kind: "moon.Divider", content: "Disabled Icon Buttons:"},
				{kind: "moon.IconButton", icon: "drawer", small: false, ontap: "buttonTapped", disabled: true},
				{kind: "moon.IconButton", icon: "search", ontap: "buttonTapped", disabled: true},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-list.png", small: false, ontap: "buttonTapped", disabled: true},
				{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-album.png", ontap: "buttonTapped", disabled: true},
				{classes:"moon-1v"},
				{kind: "moon.Divider", content: "Grouped Icon Buttons:"},
				{kind: "enyo.Group", components: [
					{kind: "moon.IconButton", icon: "drawer", active: true, ontap: "buttonTapped"},
					{kind: "moon.IconButton", icon: "search", ontap: "buttonTapped"},
					{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-list.png", ontap: "buttonTapped"},
					{kind: "moon.IconButton", src: "$lib/moonstone/samples/assets/icon-album.png", ontap: "buttonTapped"}
				]}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name:"console", content: "No changes yet"}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.console.setContent(inSender.name + " tapped.");
	}
});
