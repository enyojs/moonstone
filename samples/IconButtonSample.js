enyo.kind({
	name: "moon.sample.IconButtonSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{fit:true, components: [
			{kind: "moon.Divider", content: "Icon Buttons:"},
			{kind: "moon.IconButton", src: "./assets/icon-list.png", ontap: "buttonTapped"},
			{kind: "moon.IconButton", src: "./assets/icon-list.png", ontap: "buttonTapped"},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Deactivated Icon Buttons:"},
			{kind: "moon.IconButton", src: "./assets/icon-list.png", ontap: "buttonTapped", disabled: true},
			{kind: "moon.IconButton", src: "./assets/icon-list.png", ontap: "buttonTapped", disabled: true}
		]},
		{kind: "moon.Divider", content: "Result"},
		{kind: "moon.BodyText", name:"console", content: "No changes yet"}
	],
	buttonTapped: function(inSender, inEvent) {
		this.$.console.setContent(inSender.name + " tapped.");
	}
});