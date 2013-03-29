enyo.kind({
	name: "moon.sample.TimePickerSample",
	style: "margin:20px;",
	kind:"FittableRows",	
	classes: "moon enyo-unselectable",
	fit: true,
	handlers: {
		onChange: "changed"
	},
	components: [
		{kind: "enyo.Spotlight"},	
		{name: 'scroller', kind: 'moon.Scroller', fit: true, touch: true, components: [
			{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: $L("Choose Locale"), classes: "moon-expandable-picker-wrapper", onChange:"pickerHandler", components: [
				{content: 'en_us', active:true},
				{content: 'en_ca'},
				{content: 'en_ie'},
				{content: 'en_gb'},
				{content: 'en_mx'},
				{content: 'de_de'},
				{content: 'fr_fr'},
				{content: 'fr_ca'},
				{content: 'it_it'},
				{content: 'es_es'},
				{content: 'es_mx'},
				{content: 'es_us'}																																																								
			]},	
			{kind: "moon.TimePicker", content: "Time", meridiemEnable: true, classes: "moon-date-picker-wrapper"},		
			{name:"time", style:"font-size:0.35em;font-family:PreludeWGL Light"},
			{kind: "moon.TimePicker", meridiemEnable: true, disabled: true, noneText: "Disabled Time Picker", content: "Disabled Time", classes: "moon-date-picker-wrapper"}
		]}
	],
	pickerHandler: function(inSender, inEvent){
		if (enyo.g11n) {
			this.$.timePicker.setLocale(inEvent.selected.content);
		}
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.time){
			var timeArray = inEvent.value.toTimeString().split(":");
			this.$.time.setContent(inEvent.name + " changed to " + timeArray[0] + ":" + timeArray[1]);
		}
	}
});