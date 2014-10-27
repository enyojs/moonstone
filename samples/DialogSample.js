enyo.kind({
	name: "moon.sample.DialogSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "moon.Divider", content: "Dialog"},
		{kind: "moon.Button", content: "Open Dialog", ontap: "showDialog"},
		{classes: "moon-1v"},
		{kind: "moon.ToggleButton", content: "Showing", name: "showingToggle"},
		{kind: "moon.ToggleButton", content: "Animate", name: "animateToggle"},
		{kind: "moon.ToggleButton", content: "SpotlightModal", ontap: "buttonToggled"},
		{
			name: "dialog", 
			kind: "moon.Dialog",
			title: "You've been watching TV for a very long time so let's do a quick check-in.",
			subTitle: "This TV has been active for 10 hours.",
			message: "Perhaps it is time to take a break and get some fresh air. There is a nice coffee shop around the corner", 
			components: [
				{kind: "moon.Button", content: "Go get a coffee", ontap: "hideDialog"},
				{kind: "moon.Button", content: "Keep watching TV", ontap: "addMessage"}
			]
		}
	],
	bindings: [
		{from: ".$.showingToggle.value", to: ".$.dialog.showing", oneWay:false},
		{from: ".$.dialog.animate", to: ".$.animateToggle.value", oneWay:false}
	],
	buttonToggled: function(inSender, inEvent) {
		this.$.dialog.setSpotlightModal(inSender.getActive());
		this.$.dialog.setAutoDismiss(!inSender.getActive());
	},
	showDialog: function(inSender) {
		this.$.dialog.show();
	},
	hideDialog: function(inSender, inEvent) {
		this.$.dialog.hide();
	},
	addMessage: function() {
		this.$.dialog.setMessage(this.$.dialog.getMessage() + "<br> No, seriously, you should probably take a break.");
	}
});