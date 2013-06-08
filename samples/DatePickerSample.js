enyo.kind({
	name: "moon.sample.DatePickerSample",
	classes: "moon enyo-unselectable enyo-fit",
	handlers: {
		onChange: "changed"
	},
	components: [
		{kind: "enyo.Spotlight"},
		{kind: 'moon.Scroller', classes:"enyo-fill", touch: true, components: [
			{
				name: "langPicker", 
				kind: "moon.ExpandablePicker", 
				autoCollapse: true, 
				noneText: "No Language Selected", 
				content: "Choose Locale", 
				classes: "moon-sample-padded", 
				onChange:"pickerHandler", 
				components: [
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
				]
			},
			{
				kind: "moon.DatePicker", 
				noneText: "Pick a Date", 
				content: "Date", 
				classes: "moon-sample-padded"
			},
			{
				name: "date", 
				classes: "moon-sample-datepicker-console"
			},
			{tag: "br"},
			{
				kind: "moon.DatePicker", 
				disabled: true, 
				noneText: "Disabled Date Picker", 
				content: "Disabled Date", 
				classes: "moon-sample-padded"
			}
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
		if (this.$.date && inEvent.value){
			this.$.date.setContent(inEvent.name + " changed to " + inEvent.value.toDateString());
		}
	}
});