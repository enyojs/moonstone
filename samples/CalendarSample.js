enyo.kind({
	name: "moon.sample.CalendarSample",
	style: "margin:20px;",
	classes: "moon enyo-unselectable",
	fit: true,
	handlers: {
		onChange: "changed"
	},
	components: [
/*		{kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: $L("Choose Locale"), classes: "moon-expandable-picker-wrapper", onChange:"pickerHandler", components: [
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
		]},	*/
		{kind: "enyo.Spotlight"},
		{kind: "moon.Calendar", content: "Calendar", classes: "moon-date-picker-wrapper"},		
		{name:"date", style:"font-size:0.35em;font-family:PreludeWGL Light"}
	],
/*	changed: function(inSender, inEvent) {
		if (this.$.date){
			this.$.date.setContent(inEvent.name + " changed to " + inEvent.value.toTimeString());			
		}
	}*/
});