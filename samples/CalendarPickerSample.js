enyo.kind({
	name: "moon.sample.CalendarPickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "FittableColumns", components: [
			{kind: "moon.CalendarPicker", name: "calendar", content: "Calendar", onChange: "changed", classes: "moon-date-picker-wrapper"},
			{kind: "FittableRows", fit: true, components: [
				{kind: "moon.DatePicker", name: "picker", noneText: "Pick a Date", content: "Pick a Date", onChange: "pickDate"},
				{kind: "moon.Divider"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", name: "yearInput", content: "Year"}
				]},
				{kind: "moon.Button", small: true, content: "Set", ontap: "setYear"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", name: "monthInput", content: "Month"}
				]},
				{kind: "moon.Button", small: true, content: "Set", ontap: "setMonth"},
				{kind: "moon.InputDecorator", components: [
					{kind: "moon.Input", name: "dateInput", content: "Date"}
				]},
				{kind: "moon.Button", small: true, content: "Set", ontap: "setDate"}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "result", content: "No change yet"}
	],
	setYear: function(inSender, inEvent) {
		if(this.$.yearInput.getValue()) {
			this.$.calendar.setYear(this.$.yearInput.getValue());	
		}		
	},
	setMonth: function(inSender, inEvent) {
		if(this.$.monthInput.getValue() > 0 && this.$.monthInput.getValue() < 13) {
			this.$.calendar.setMonth(parseInt(this.$.monthInput.getValue() - 1, 10));
		} else {
			this.$.result.setContent("Please input value between 1 to 12");
		}
	},
	setDate: function(inSender, inEvent) {
		if(this.$.dateInput.getValue()) {
			this.$.calendar.setDate(this.$.dateInput.getValue());
		}		
	},
	pickDate: function(inSender, inEvent) {
		if (inEvent.value){
			this.$.calendar.setValue(inEvent.value);
		}
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent("Current Date" + " changed to " + inEvent.value.toDateString());
		}
	}
});