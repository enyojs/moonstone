enyo.kind({
	name: "moon.sample.TimePickerSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: "moon-5h", components: [
				{kind: "moon.TimePicker", name:"picker", content: "Time", meridiemEnable: true, onChange: "changed", hourText: $L("hour"), minuteText: $L("minute"), meridianText: $L("meridian")},
				{kind: "moon.TimePicker", name:"disabledPicker", meridiemEnable: true, disabled: true, noneText: $L("Disabled Time Picker"), content: "Disabled Time"},
				{name: "localePicker", kind: "moon.ExpandablePicker", noneText: $L("No Locale Selected"), content: "Choose Locale", onChange:"pickerHandler", components: [
					{content: "Use Default Locale", active: true},
					{content: 'en-US'},
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
		{name: "result", content: "No change yet"}
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
		this.$.result.setContent("locale changed to " + opt);
		return true;
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			var timeArray = inEvent.value.toTimeString().split(":");
			this.$.result.setContent(inEvent.name + " changed to " + timeArray[0] + ":" + timeArray[1]);
		}
	}
});