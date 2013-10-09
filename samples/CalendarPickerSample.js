enyo.kind({
	name: "moon.sample.CalendarPickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "FittableRows",
	components: [
		{kind: "moon.Scroller", fit:true, components: [
			{kind: "FittableColumns", components: [
				{kind: "moon.CalendarPicker", name: "calendar", onChange: "changed"},
				{kind: "FittableRows", fit: true, components: [
					{kind: "moon.DatePicker", name: "picker", noneText: "Pick a Date", content: "Pick a Date", onChange: "pickDate"},
					{kind: "moon.ExpandablePicker", name:"localePicker", noneText: "No Language Selected", content: "Choose Locale", onChange: "setLocale", components: [
						{content: "en-US", active:true}, //United States, firstDayOfWeek: 1
						//{content: "th-TH"},	//Thailand
						{content: "en-CA"},	//Canada, firstDayOfWeek: 1
						{content: "ko-KO"}, //Korea, firstDayOfWeek: 0
						{content: "und-AE"}, //United Arab Emirates, firstDayOfWeek: 6
						{content: "und-AG"}, //Antigua and Barbuda, firstDayOfWeek: 0
						{content: "und-CA"},//Canada, firstDayOfWeek: 0
						{content: "it-CH"},	//Italian
						{content: "en-MX"},
						{content: "de-DE"},
						{content: "fr-FR"},
						{content: "fr-CA"},
						{content: "it-IT"},
						{content: "es-ES"},
						{content: "es-MX"}
					]},
					{kind: "moon.ExpandablePicker", name:"dowLengthPicker", content: "Choose DOW Label Length", onChange: "setLabelLength", components: [
						{content: "short", active: true},
						{content: "medium"},
						{content: "long"},
						{content: "full"}
					]},
					{kind: "moon.ExpandablePicker", content: "Choose DOW Label Class", onChange: "setLabelStyle", components: [
						{content: "Default", active: true, className:""},
						{content: "Divider", className:"moon-divider moon-divider-text"}
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
		{kind: "moon.BodyText", name: "result", content: "No change yet"}
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.$.dowLengthPicker.hide();
			this.log("iLib not present -- hiding locale & dow length picker");
		}
	},
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
	setLabelLength: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekLength(inEvent.content);
		}
		return true;
	},
	setLabelStyle: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekClasses(inEvent.selected.className);
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
			this.$.result.setContent("Current Date" + " changed to " + inEvent.value.toDateString());
		}
	}
});