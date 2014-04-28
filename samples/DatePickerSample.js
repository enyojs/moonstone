enyo.kind({
	name: "moon.sample.DatePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-7h", components: [
				{kind: "moon.DatePicker", name:"picker", noneText: "Pick a Date", content: "Date", onChange: "changed"},
				{kind: "moon.DatePicker", name:"disabledPicker", disabled: true, noneText: "Disabled Date Picker", content: "Disabled Date"},
				{classes:"moon-hspacing", components: [
					{kind: "moon.InputDecorator", classes: "moon-2h", components: [
						{kind: "moon.Input", name:"yearInput", placeholder: "Year"}
					]},
					{kind: "moon.InputDecorator", classes: "moon-2h", components: [
						{kind: "moon.Input", name:"monthInput", placeholder: "Month"}
					]},
					{kind: "moon.InputDecorator", classes: "moon-2h", components: [	
						{kind: "moon.Input", name:"dayInput", placeholder: "Day"}
					]}
				]},
				{classes:"moon-hspacing", components: [
					{kind: "moon.Button", small:true, content:"Set Date", ontap:"setDate"},
					{kind: "moon.Button", small:true, content:"Reset to Current", ontap:"resetDate"}
				]},
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
	setDate: function() {
		var year = isNaN(parseInt(this.$.yearInput.getValue())) ? this.$.picker.value.getFullYear() : parseInt(this.$.yearInput.getValue());
		var month = isNaN(parseInt(this.$.monthInput.getValue())) ? this.$.picker.value.getMonth() : parseInt(this.$.monthInput.getValue()) - 1;
		var day = isNaN(parseInt(this.$.dayInput.getValue())) ? this.$.picker.value.getDate() : parseInt(this.$.dayInput.getValue());
		this.$.picker.setValue(new Date(year, month, day));
	},
	resetDate: function() {
		this.$.picker.setValue(new Date());
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});