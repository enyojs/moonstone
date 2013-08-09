enyo.kind({
	name: "sun.sample.IconButtonSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{fit:true, components: [
			{kind: "moon.Divider", content: "Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-list.png", ontap: "buttonTapped"},
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-list.png", ontap: "buttonTapped"}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Deactivated Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/icon-list.png", ontap: "buttonTapped", disabled: true},
				{kind: "sun.IconButton", src: "assets/icon-list.png", ontap: "buttonTapped", disabled: true}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "console", content: "No changes yet"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.name+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	}
});