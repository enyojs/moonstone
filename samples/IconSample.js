enyo.kind({
	name: "moon.sample.IconSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{fit:true, components: [
			{kind: "moon.Divider", content: "Font-based Icons:"},
			{kind: "moon.Icon", icon: "drawer", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowdown", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowup", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowleft", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowright", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "x", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "check", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "zoom", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "handi", small: false, ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "gear", small: false, ontap: "buttonTapped"},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Small Font-based Icons:"},
			{kind: "moon.Icon", icon: "drawer", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowdown", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowup", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowleft", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "arrowright", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "x", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "check", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "zoom", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "handi", ontap: "buttonTapped"},
			{kind: "moon.Icon", icon: "gear", ontap: "buttonTapped"},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Image Asset Icons:"},
			{kind: "moon.Icon", src: "assets/icon-list.png", ontap: "buttonTapped"},
			{kind: "moon.Icon", src: "assets/icon-album.png", ontap: "buttonTapped"},
			{classes:"moon-1v"},
			{kind: "moon.Divider", content: "Disabled Icon:"},
			{kind: "moon.Icon", icon: "drawer", ontap: "buttonTapped", disabled: true},
			{kind: "moon.Icon", icon: "zoom", ontap: "buttonTapped", disabled: true},
			{kind: "moon.Icon", src: "assets/icon-list.png", ontap: "buttonTapped", disabled: true},
			{kind: "moon.Icon", src: "assets/icon-album.png", ontap: "buttonTapped", disabled: true}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name:"console", content: "No changes yet"}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.console.setContent(inSender.name + " tapped.");
	}
});
