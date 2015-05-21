enyo.kind({
	name: "moon.sample.TimePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-7h moon-vspacing-s", components: [
				{kind: "moon.DatePicker", name:"pickerDateLinked", noneText: "Pick a Date", content: "Linked Date", onChange: "dateChanged"},
				{kind: "moon.TimePicker", name:"pickerTimeLinked", noneText: "Pick a Time", content: "Linked Time", meridiemEnable: true, onChange: "timeChanged"},
				{kind: "moon.TimePicker", name: "pickerTime", noneText: "Pick a Time", content: "Time", meridiemEnable: true, onChange: "timeChanged"},
				{kind: "moon.Button", name: "buttonReset", content: "Reset Time", small: true, ontap: "resetTapped"},
				{kind: "moon.TimePicker", name:"pickerDisabled", meridiemEnable: true, disabled: true, noneText: "Disabled Time Picker", content: "Disabled Time"},
				{kind: "moon.ExpandablePicker", name: "pickerLocale", noneText: "No Locale Selected", content: "Choose Locale", onChange:"setLocale", components: [
					{content: "Use Default Locale", active: true},
					{content: "am-ET"},
					{content: "ko-KR"},
					{content: "zh-TW"},
					{content: "fa-IR"},
					{content: "ar-SA"},
					{content: "ur-IN"},
					{content: "th-TH"},	//Thailand
					{content: "en-US"},
					{content: "jp-JP"},
					{content: "en-CA"},
					{content: "en-IE"},
					{content: "en-GB"},
					{content: "en-MX"},
					{content: "de-DE"},
					{content: "fr-FR"},
					{content: "fr-CA"},
					{content: "it-IT"},
					{content: "es-ES"},
					{content: "es-MX"},
					{content: "es-US"}
				]}
			]}
		]},
		{kind: "moon.Divider", content:"Result"},
		{kind: "moon.BodyText", name: "result", content: "No change yet"}
	],
	bindings: [
		{from:".value", to:".$.pickerDateLinked.value", oneWay:false},
		{from:".value", to:".$.pickerTimeLinked.value", oneWay:false}
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.pickerLocale.hide();
			this.log("iLib not present -- hiding locale picker");
		}
		this.set("value", new Date("Mar 09 2014 01:59"));
	},
	setLocale: function(inSender, inEvent){
		if (window.ilib) {
			var locale = inEvent.selected.content,
				val = (locale == "Use Default Locale") ? null : locale;
			enyo.updateLocale(locale);
			this.$.pickerDateLinked.setLocale(val);
			this.$.pickerTimeLinked.setLocale(val);
			this.$.pickerTime.setLocale(val);
			this.$.pickerDisabled.setLocale(val);
			this.$.result.setContent("locale changed to " + locale);
		}
		return true;
	},
	timeChanged: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			var timeArray = inEvent.value.toTimeString().split(":");
			this.$.result.setContent(inEvent.name + " changed to " + timeArray[0] + ":" + timeArray[1]);
		}
	},
	dateChanged: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	},
	resetTapped: function(inSender, inEvent) {
		this.$.pickerTime.set("open", false);
		this.$.pickerTime.set("value", null);
		return true;
	}
});