enyo.kind({
	name: "moon.sample.DatePickerSample",
	kind:"FittableRows",
	style: "margin:20px;",
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
			{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date", classes: "moon-date-picker-wrapper"},
			{name:"date", style:"font-size:0.35em;font-family:MuseoSans Light"},
			{kind: "moon.DatePicker", disabled: true, noneText: "Disabled Date Picker", content: "Disabled Date", classes: "moon-date-picker-wrapper"}
		]}
	],
	create: function(){
		this.inherited(arguments);
		// setTimeout(enyo.bind(this, function(){
		//	this.$.datePicker.setValue(new Date('1-29-13'));
		// }),1000)
	},
	pickerHandler: function(inSender, inEvent){
		if (enyo.g11n) {
			this.$.datePicker.setLocale(inEvent.selected.content);
		}
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.date){
			this.$.date.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});