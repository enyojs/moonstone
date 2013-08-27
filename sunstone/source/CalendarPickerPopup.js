enyo.kind({
	name: "sun.CalendarPickerPopup",
	kind: "sun.PopupPanel",
	title: "Calendar",
	events: {		
		onSaved: "",
		onClosed: "",
	},
	published: {
		value: "",
	},
	components: [
		{name: "scroller", kind: "sun.Scroller", classes: "enyo-fill", components: [
			{name: "calendar", kind: "sun.CalendarPicker", onChange: "changed"},
		]},				
	],
	footerComponents: [
		{kind: "sun.Button", flexOrient: "column", flex: true, content: "Cancel", ontap: "cancel_clicked"},
		{kind: "sun.Button", flexOrient: "column", flex: true, content: "OK", ontap: "ok_clicked"}
	],			
	changed: function(inSender, inEvent) {
		if (inEvent.value){
			this.value = inEvent.value.toDateString();
		}
	},
	cancel_clicked: function() {
		this.doClosed();
	},
	ok_clicked: function() {
		this.doSaved({value: this.value});
	},
	setYear: function(inNew) {
		this.$.calendar.setYear(inNew);
	},
	setMonth: function(inNew) {
		this.$.calendar.setMonth(inNew);		
	},
	setDate: function(inNew) {
		this.$.calendar.setDate(inNew);
	}
});
