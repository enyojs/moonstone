enyo.kind({
	name: "sun.CalendarPickerPopup",
	kind: "sun.PopupPanel",
	title: "Calendar",
	//* public
	events: {		
		onSaved: "",
		onClosed: ""
	},
	published: {
		value: ""
	},
	components: [
		{name: "scroller", kind: "sun.Scroller", classes: "enyo-fill", components: [
			{name: "calendar", kind: "sun.CalendarPicker", onChange: "changed"}
		]}				
	],
	footerComponents: [
		{kind: "sun.Button", flexOrient: "column", flex: true, content: "Cancel", ontap: "cancel_tapped"},
		{kind: "sun.Button", flexOrient: "column", flex: true, content: "OK", ontap: "ok_tapped"}
	],			
	changed: function(inSender, inEvent) {
		if (inEvent.value){
			this.value = inEvent.value.toDateString();
		}
	},
	cancel_tapped: function() {
		this.doClosed();
	},
	ok_tapped: function() {
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
