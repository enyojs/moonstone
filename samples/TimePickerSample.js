enyo.kind({
	name: "moon.sample.TimePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-7h", components: [
				{kind: "moon.DatePicker", name:"datepicker", noneText: "Pick a Date", content: "Date", onChange: "datechanged"},
				{kind: "moon.TimePicker", name:"timepicker", content: "Time", meridiemEnable: true, onChange: "timechanged"},
				{kind: "moon.TimePicker", name:"disabledPicker", meridiemEnable: true, disabled: true, noneText: "Disabled Time Picker", content: "Disabled Time"},
				{name: "localePicker", kind: "moon.ExpandablePicker", noneText: "No Locale Selected", content: "Choose Locale", onChange:"pickerHandler", components: [
					{content: "Use Default Locale", active: true},
					{content: 'jp-JP'},
					{content: 'en-US'},
					{content: 'ko-KR'},
					{content: "th-TH"},	//Thailand
					{content: 'en-CA'},
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
				]}
			]}
		]},
		{kind: "moon.Divider", content:"Result"},
		{kind: "moon.BodyText", name: "result", content: "No change yet"}
	],
	bindings: [
		{from:".value", to:".$.datepicker.value", oneWay:false},
		{from:".value", to:".$.timepicker.value", oneWay:false}
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.log("iLib not present -- hiding locale picker");
		}
		this.set("value", new Date("Mar 09 2014 01:59"));
	},
	pickerHandler: function(inSender, inEvent){
		var opt = inEvent.selected.content,
			val = (opt == "Use Default Locale") ? null : opt;
		this.$.datepicker.setLocale(val);
		this.$.timepicker.setLocale(val);
		this.$.disabledPicker.setLocale(val);
		this.$.result.setContent("locale changed to " + opt);
		return true;
	},
	timechanged: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			var timeArray = inEvent.value.toTimeString().split(":");
			this.$.result.setContent(inEvent.name + " changed to " + timeArray[0] + ":" + timeArray[1]);
		}
	},
	datechanged: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});