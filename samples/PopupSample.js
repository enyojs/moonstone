enyo.kind({
	name: "moon.sample.PopupSample",
	classes: "moon",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Popups"},

		{classes: "moon-hspacing", components: [
			{kind: "moon.Button", content: "Basic Popup", ontap: "showPopup", popup: "basicPopup"},
			{kind: "moon.Button", content: "Long Popup", ontap: "showPopup", popup: "longPopup"},
			{kind: "moon.Button", content: "Button in Popup", ontap: "showPopup", popup: "buttonPopup"}
		]},

		{name: "basicPopup", kind: "moon.Popup", content: "Popup..."},
		{name: "longPopup", kind: "moon.Popup", allowHtml: true, content: "Don't go changing, to try and please me  <br>You never let me down before  <br>Don'timagine you're too familiar  <br>And I don't see you anymore  <br>I wouldn't leave you in times of trouble  <br>We never could have come this far I took the good times, I'll take the bad times I'll take you just the way you are Don't go trying some new fashion Don't change the color of your hair You always have my unspoken passion Although I might not seem to care I don't want clever conversation I never want to work that hard I just want someone that I can talk to I want you just the way you are. I need to know that you will always be The same old someone that I knew What will it take till you believe in me The way that I believe in you. "},
		{name: "buttonPopup", kind: "moon.Popup", components: [
			{kind: "moon.Divider", content: "Buttons in popup example"},
			{classes: "moon-hspacing", components: [
				{kind: "moon.Button", content: "Hello"},
				{kind: "moon.Button", content: "Goodbye"}
			]}
		]}
	],
	showPopup: function(inSender) {
		this.hidePopups();
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	},
	hidePopups: function() {
		this.$.basicPopup.hide();
		this.$.longPopup.hide();
		this.$.buttonPopup.hide();
	}
});