enyo.kind({
	name: "moon.sample.TimePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-5h", components: [
				{kind: "moon.TimePicker", name:"picker", content: "Time", meridiemEnable: true, onChange: "changed"},
				{kind: "moon.TimePicker", name:"disabledPicker", meridiemEnable: true, disabled: true, noneText: "Deactivated Time Picker", content: "Deactivated Time"},
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
		{name: "result", content: "No change yet"}
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
			var timeArray = inEvent.value.toTimeString().split(":");
			this.$.result.setContent(inEvent.name + " changed to " + timeArray[0] + ":" + timeArray[1]);
		}
	}
});