enyo.kind({
	name: "sun.sample.PopupTimePicker",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Popup Time Picker"},
		{classes: "moon-hspacing", components: [
			{kind: "sun.Button", content: "Button in Popup Time Picker", ontap: "showPopup", popup: "time"}
		]},

		{
			name: "time",
			kind: "sun.PopupPanel",
			title: "Title",
			components: [
				{name:"picker", kind: "sun.TimePicker", content: "Time", meridiemEnable: true}
			],
			footerComponents: [
				{kind: "sun.Button", flexOrient: "column", flex: true, content: "Cancel"},
				{kind: "sun.Button", flexOrient: "column", flex: true, content: "OK"}
			]
		}
	],
	popupActivator: null,
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	}
});