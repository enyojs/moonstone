enyo.kind({
	name: "moon.sample.DatePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-5h", components: [
				{kind: "moon.DatePicker", name:"picker", noneText: "Pick a Date", content: "Date", onChange: "changed"},
				{kind: "moon.DatePicker", name:"disabledPicker", disabled: true, noneText: "Disabled Date Picker", content: "Disabled Date"},
				{name: "langPicker", kind: "moon.ExpandablePicker", noneText: "No Language Selected", content: "Choose Locale", onChange:"pickerHandler", components: [
					{content: 'en-US', active: true},
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
		var selected = this.$.langPicker.getSelected();
		if (selected) {
			this.$.picker.setLocale(selected.content);
			this.$.disabledPicker.setLocale(selected.content);
		}
	},
	pickerHandler: function(inSender, inEvent){
		if (ilib) {
			this.$.picker.setLocale(inEvent.selected.content);
			this.$.disabledPicker.setLocale(inEvent.selected.content);
		}
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});