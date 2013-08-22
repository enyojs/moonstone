enyo.kind({
	name: "sun.sample.IconButtonSample",
	kind: "FittableRows",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Scroller", horizontal: "hidden", fit: true, components: [
			{kind: "sun.Divider", content: "Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-close-button.png", ontap: "buttonTapped"},
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-close-button.png", ontap: "buttonTapped"}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "sun.Divider", content: "Deactivated Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-close-button.png", ontap: "buttonTapped", disabled: true},
				{kind: "sun.IconButton", src: "assets/1080x1920/icon-close-button.png", ontap: "buttonTapped", disabled: true}
			]},
			{kind: "sun.Divider", content: "Samll Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, ontap: "buttonTapped"},
				{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, ontap: "buttonTapped"}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "sun.Divider", content: "Deactivated Samll Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, ontap: "buttonTapped", disabled: true},
				{kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, ontap: "buttonTapped", disabled: true}
			]},
			{tag: "br"},
			{tag: "br"},
			{kind: "sun.Divider", content: "Loading Samll Icon Buttons:"},
			{classes: "moon-hspacing", components: [
				{name: "loading", kind: "sun.IconButton", src: "assets/1080x1920/small-icon-close-button.png", small: true, ontap: "loadingButtonTapped", loading: false}
			]}
		]},
		{kind: "sun.Divider", content: "Result"},
		{name: "console", content: "No changes yet"}
	],
	buttonTapped: function(inSender, inEvent) {
		var str = '"'+inSender.name+'" ';
		str += inSender.getActive() ? 'selected' : 'unselected';
		str += '.';
		this.$.console.setContent(str);
	},
	loadingButtonTapped: function(inSender, inEvent) {
		this.$.loading.setLoading(!this.$.loading.getLoading());
		this.buttonTapped(inSender, inEvent);
	}
});