enyo.kind({
	name: "sun.sample.CalendarPickerSample",
	classes: "sun moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "sun.Divider", content: "Popup Time Picker"},
		{classes: "moon-hspacing", components: [
			{kind: "sun.Button", content: "Date Picker", ontap: "showPopup", popup: "calendarpopup"}
		]},		
		{kind: "moon.Divider", content: "Result"},
		{name: "result", content: "No change yet"},
		{name: "calendarpopup", kind: "sun.CalendarPickerPopup", onSaved: "saved", onClosed: "closed"}
	],
	popupActivator: null,
	initdefault: function() {
		// Calendar will indicate today automatically/
		// if you wanna set the specific day, you can use below functions.		 
		this.$.calendarpopup.setYear(2013);
		this.$.calendarpopup.setMonth(11);
		this.$.calendarpopup.setDate(13);
	},
	showPopup: function(inSender) {
		var p = this.$[inSender.popup];
		if (p) {
			p.show();
			this.initdefault();
		}
	},
	saved: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent("Current Date" + " changed to " + inEvent.value);
		}
		this.$.calendarpopup.hide();
	},
	closed: function() {
		this.$.calendarpopup.hide();
	}
});

