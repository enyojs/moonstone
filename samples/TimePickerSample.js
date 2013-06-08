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
		{name: 'scroller', kind: 'moon.Scroller', classes:"moon-time-picker-sample-scroller", touch: true, components: [
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
			{kind: "moon.TimePicker", content: "Time", meridiemEnable: true, classes: "moon-date-picker-wrapper"},
			{name:"time", style:"font-size:0.35em;font-family:MuseoSans Light"},
			{kind: "moon.TimePicker", meridiemEnable: true, disabled: true, noneText: "Disabled Time Picker", content: "Disabled Time", classes: "moon-date-picker-wrapper"}
		]}
	],
	create: function(){
		this.inherited(arguments);
		var selected = this.$.langPicker.getSelected();
		if (selected) {
			for (var i in this.$) {
				if (this.$[i].kind == "moon.TimePicker") {
					this.$[i].setLocale(selected.content);
				}
			}
		}
	},
	pickerHandler: function(inSender, inEvent){
		if (ilib) {
			this.$.timePicker.setLocale(inEvent.selected.content);;
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