enyo.kind({
	name: "moon.sample.IconButtonSample",
	fit: true,
	classes: "moon enyo-unselectable moon-icon-button-sample",
	components: [
		{kind: "enyo.Spotlight"},
		{classes: "moon-icon-button-sample-wrapper moon-icon-button-sample-group", components: [
			{kind: "moon.Divider", content: "Icon Buttons:"},
			{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", ontap: "buttonTapped"},
			{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", ontap: "buttonTapped"},
			{tag: "br"},
			{tag: "br"},
			{kind: "moon.Divider", content: "Disabled Icon Buttons:"},
			{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", ontap: "buttonTapped", disabled: true},
			{kind: "moon.IconButton", src: "assets/icon-button-enyo-logo.png", ontap: "buttonTapped", disabled: true}
		]},
		{name: "console", classes: "moon-icon-button-sample-console"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.name+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	}
});