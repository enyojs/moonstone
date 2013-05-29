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
			{name: "langPicker", kind: "moon.ExpandablePicker", noneText: "No Language Selected", autoCollapse: true, content: "Choose Locale", classes: "moon-expandable-picker-wrapper", onChange:"pickerHandler", components: [
				{content: 'en-US', active:true},
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
			]},
			{kind: "moon.DatePicker", noneText: "Pick a Date", content: "Date", classes: "moon-date-picker-wrapper"},
			{name:"date", style:"font-size:0.35em;font-family:PreludeWGL Light"},
			{kind: "moon.DatePicker", disabled: true, noneText: "Disabled Date Picker", content: "Disabled Date", classes: "moon-date-picker-wrapper"}
		]}
	],
	create: function(){
		this.inherited(arguments);
		var selected = this.$.langPicker.getSelected();
		if (selected) {
			for (var i in this.$) {
				if (this.$[i].kind == "moon.DatePicker") {
					this.$[i].setLocale(selected.content);
				}
			}
		}
	},
	pickerHandler: function(inSender, inEvent){
		if (ilib) {
			this.$.datePicker.setLocale(inEvent.selected.content);;
		}
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.date){
			this.$.date.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});