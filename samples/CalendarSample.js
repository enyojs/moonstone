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
						{kind: "moon.Input", name:"input", value:"January 01 2013 11:22:59    "}
					]},
					{kind: "moon.Button", small:true, content:"Set Date", ontap:"setDate"},
					{kind: "moon.Button", small:true, content:"Reset to Current", ontap:"resetDate"}
				]},
				{classes:"moon-1v"},
				{classes:"moon-7h", components: [
					{kind: "moon.DatePicker", name: "picker", noneText: "Pick a Date", content: "Pick a Date"},
					{kind: "moon.ExpandablePicker", name:"localePicker", noneText: "No Language Selected", content: "Choose Locale", onChange: "setLocale", components: [
						{content: "en-US", active:true}, //United States, firstDayOfWeek: 0
						{content: "th-TH"}, //Thailand
						{content: "en-CA"}, //Canada, firstDayOfWeek: 0
						{content: "ko-KO"}, //Korea, firstDayOfWeek: 1
						{content: "und-AE"}, //United Arab Emirates, firstDayOfWeek: 6
						{content: "und-AG"}, //Antigua and Barbuda, firstDayOfWeek: 0
						{content: "und-CA"}, //Canada, firstDayOfWeek: 0
						{content: "it-CH"}, //Italian
						{content: "en-MX"},
						{content: "de-DE"}, // Germany, firstDayOfWeek: 1
						{content: "fr-FR"}, // France, firstDayOfWeek: 1
						{content: "fr-CA"},
						{content: "it-IT"}, // Italy, firstDayOfWeek: 1
						{content: "es-ES"}, // Spain, firstDayOfWeek: 1
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
						{content: "Divider", className:"moon-divider moon-divider-text"},
						{content: "Smaller font", className: "moon-calendar-picker-day small"}
					]}
				]}
			]},
			{kind: "moon.Divider", content: "Result"},
			{kind: "moon.BodyText", name: "result", content: "No change yet"}
		]}
	],
	bindings: [
		{from: ".$.calendar.value", to:".$.picker.value", oneWay:false},
		{from: ".$.calendar.value", to:".$.input.value", transform: function(val) { return window.ilib ? this.df.format(val) : val.toDateString();	} }
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.$.dowLengthPicker.hide();
			this.log("iLib not present -- hiding locale & dow length picker");
		} else {
			this.df = new ilib.DateFmt({
				type: "datetime",
				time: "hmsa",
				date: "dmy",
				useNative: false,
				length: "short"
			});
		}
	},
	
	updateCurrentString: function (date) {
		var formatted = window.ilib ? this.df.format(date) : date.toDateString();
		this.$.result.setContent("Current Date" + " changed to " + formatted);
	},
	
	setLocale: function(inSender, inEvent){
		if (ilib) {
			ilib.setLocale(inEvent.selected.content);
			this.$.calendar.setLocale(inEvent.selected.content);
			this.$.picker.setLocale(inEvent.selected.content);
			this.df = new ilib.DateFmt({
				type: "datetime",
				time: "hmsa",
				date: "dmy",
				useNative: false,
				length: this.$.dowLengthPicker.selected.content
			});
			this.$.input.setValue(this.df.format(this.$.calendar.getValue()));
			this.updateCurrentString(this.$.calendar.getValue());
		}
		return true;
	},
	setLabelLength: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekLength(inEvent.content);
			if (ilib) {
				this.df = new ilib.DateFmt({
					type: "datetime",
					time: "hmsa",
					date: "dmy",
					useNative: false,
					length: inEvent.content
				});
			}
			this.updateCurrentString(this.$.calendar.getValue());
			this.removeLabelItem(this.$.dowLabelClass, inEvent, 'Divider', 'full');
		}
		return true;
	},
	setLabelStyle: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekClasses(inEvent.selected.className);
			this.removeLabelItem(this.$.dowLengthPicker, inEvent, 'full', 'Divider');
		}
		return true;
	},
	removeLabelItem: function (inControl, inEvent, inLabelName1, inLabelName2) {
		var i,
			c = inControl.getClientControls();
		for (i = 0; i < c.length; i++) {
			if (c[i].content == inLabelName1) {
				c[i].addRemoveClass("moon-calendar-dow-lable-nodisplay", Boolean(inEvent.content == inLabelName2));
			}
		}
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value) {
			this.updateCurrentString(inEvent.value);
		}
	},
	setDate: function(inSender, inEvent){
		this.$.calendar.setValue(new Date(this.$.calendar.getValue()));
	},
	resetDate: function() {
		this.$.calendar.setValue(null);
	}
});