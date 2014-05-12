enyo.kind({
	name: "moon.sample.DatePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-7h moon-vspacing-s", components: [
				{kind: "moon.DatePicker", name:"picker", noneText: "Pick a Date", content: "Date", onChange: "changed"},
				{kind: "moon.Button", name: "buttonReset", content: "Reset Date", small: true, ontap: "resetTapped"},
				{kind: "moon.DatePicker", name:"disabledPicker", disabled: true, noneText: "Disabled Date Picker", content: "Disabled Date"},
				{name: "localePicker", kind: "moon.ExpandablePicker", noneText: "No Locale Selected", content: "Choose Locale", onChange:"pickerHandler", components: [
					{content: 'Use Default Locale', active: true},
					{content: 'en-US'},
					{content: "th-TH"},	//Thailand
					{content: 'ko-KR'},
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
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.log("iLib not present -- hiding locale picker");
		}
	},
	pickerHandler: function(inSender, inEvent){
		var opt = inEvent.selected.content,
			val = (opt == "Use Default Locale") ? null : opt;
		this.$.picker.setLocale(val);
		this.$.disabledPicker.setLocale(val);
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	},
	resetTapped: function(inSender, inEvent) {
		this.$.picker.set("value", null);
		return true;
	}
});