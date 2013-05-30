enyo.kind({
	name: "moon.sample.DialogSample",
	classes: "moon",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Dialog"},

		{kind: "moon.Button", content: "Basic Dialog", ontap: "showPopup", popup: "basicPopup"},
		{
			name: "basicPopup", 
			kind: "moon.Dialog", 
			title: "You've been watching TV very long time.", 
			message: "Perhaps it is time to take a break and get some fresh air. There is a nice coffe shop around the corner", 
			components: [
				{kind: "moon.Button", content: "Go get a coffee"},
				{kind: "moon.Button", content: "Keep watching TV"},
			]
		}
	],
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
		}
	}
});