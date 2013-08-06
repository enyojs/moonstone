enyo.kind({
	name: "moon.sample.CalendarPickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "FittableRows",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "FittableColumns", components: [
				{kind: "moon.CalendarPicker", name: "calendar", onChange: "changed"},
				{kind: "FittableRows", fit: true, components: [
					{kind: "moon.DatePicker", name: "picker", noneText: "Pick a Date", content: "Pick a Date", onChange: "pickDate"},
					{name: "langPicker", kind: "moon.ExpandablePicker", noneText: "No Language Selected", content: "Choose Locale", onChange: "setLocale", components: [
						{content: 'en-US', active:true},
						{content: 'th-TH'},	//Thailand
						{content: 'en-CA'},	//Canada
						{content: 'en-IE'},
						{content: 'en-GB'},
						{content: 'en-MX'},
						{content: 'de-DE'},
						{content: 'fr-FR'},
						{content: 'fr-CA'},
						{content: 'it-IT'},
						{content: 'es-ES'},
						{content: 'es-MX'},
						{content: 'es-US'}
					]},
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
			this.$.calendar.setMonth(parseInt(this.$.monthInput.getValue(), 10));
		} else {
			this.$.result.setContent("Please input value between 1 to 12");
		}
	},
	setDate: function(inSender, inEvent) {
		if(this.$.dateInput.getValue()) {
			this.$.calendar.setDate(this.$.dateInput.getValue());
		}		
	},
	setLocale: function(inSender, inEvent){
		if (ilib) {
			this.$.calendar.setLocale(inEvent.selected.content);
		}
		return true;
	},
	pickDate: function(inSender, inEvent) {
		if (inEvent.value){
			this.$.calendar.setValue(inEvent.value);
		}
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent("Current Date" + " changed to " + inEvent.originator.parseDate());
		}
	}
});