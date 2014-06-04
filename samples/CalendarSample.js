enyo.kind({
	name: "moon.sample.CalendarSample",
	classes: "moon enyo-unselectable enyo-fit",
	kind: "FittableColumns",
	components: [
		{components: [
			{kind: "moon.Calendar", name: "calendar", onChange: "changed"}
		]},
		{kind: "FittableRows", fit: true, components: [
			{kind: "moon.Scroller", fit:true, components: [
				{kind:"moon.Divider", content:"Set value:"},
				{classes:"moon-hspacing", components: [
					{kind: "moon.InputDecorator", components: [
						{kind: "moon.Input", name:"input", value:"Jan 01 2013 11:22:59"}
					]},
					{kind: "moon.Button", small:true, content:"Set Date", ontap:"setDate"},
					{kind: "moon.Button", small:true, content:"Reset to Current", ontap:"resetDate"}
				]},
				{classes:"moon-1v"},
				{classes:"moon-7h", components: [
					{kind: "moon.DatePicker", name: "picker", noneText: "Pick a Date", content: "Pick a Date"},
					{kind: "moon.ExpandablePicker", name:"localePicker", noneText: "No Language Selected", content: "Choose Locale", onChange: "setLocale", components: [
						{content: "en-US", active:true}, //United States, firstDayOfWeek: 1
						{content: "th-TH"},	//Thailand
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
					]}
				]}
			]},
			{kind: "moon.Divider", content: "Result"},
			{kind: "moon.BodyText", name: "result", content: "No change yet"}
		]}
	],
	bindings: [
		{from: ".$.calendar.value", to:".$.picker.value", oneWay:false},
		{from: ".$.calendar.value", to:".$.input.value", transform: function(val) {return val.toDateString();} }
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.$.dowLengthPicker.hide();
			this.log("iLib not present -- hiding locale & dow length picker");
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
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent("Current Date" + " changed to " + inEvent.value.toDateString());
		}
	},
	setDate: function(inSender, inEvent){
		this.$.calendar.setValue(new Date(this.$.input.getValue()));
	},
	resetDate: function() {
		this.$.calendar.setValue(new Date());
	}
});