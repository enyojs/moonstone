enyo.kind({
	name: "moon.sample.DialogSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Divider", content: "Dialog"},
		{kind: "moon.Button", content: "Basic Dialog", ontap: "showDialog"},
		{
			name: "dialog", 
			kind: "moon.Dialog", 
			title: "You've been watching TV very long time.", 
			message: "Perhaps it is time to take a break and get some fresh air. There is a nice coffe shop around the corner", 
			components: [
				{kind: "moon.Button", content: "Go get a coffee", ontap: "hideDialog"},
				{kind: "moon.Button", content: "Keep watching TV", ontap: "hideDialog"}
			]
		}
	],
	showDialog: function(inSender) {
		this.$.dialog.show();
	},
	hideDialog: function(inSender, inEvent) {
		this.$.dialog.hide();
	}
});