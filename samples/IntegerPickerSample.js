enyo.kind({
	name: 'moon.sample.IntegerPickerSample',
	kind: 'FittableRows',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: 'moon.Scroller', fit:true, components: [
			{kind: 'moon.Divider', content: 'Integer Picker'},
			{name: 'picker', kind: 'moon.IntegerPicker', value: 2013, min: 1900, max: 2100, minWidth: 84, onChange: 'changed'},

			{kind: 'moon.Divider', content:'Options'},
			{kind: 'moon.FormCheckbox', content: 'Animate', checked: true, prop: 'animate', onchange: 'checked'},
			{kind: 'moon.FormCheckbox', content: 'Wrap', prop: 'wrap', onchange: 'checked'},
			{kind: 'moon.FormCheckbox', content: 'Padding (5 digits)', onchange: 'paddingChecked'},
			{kind: 'moon.FormCheckbox', content: 'Disabled', prop: 'disabled', onchange: 'checked'},
			{kind: "moon.ExpandablePicker", name:"localePicker", noneText: "No Language Selected", content: "Choose Locale", onChange: "setLocale", components: [
				{content: 'Use Default Locale', active: true},
				{content: "en-US"}, //United States, firstDayOfWeek: 0				
				{content: "fa-IR"}, //Iran persian calendar
				{content: "th-TH"}, //Thailand
				{content: "jp-JP"}, //Japan
				{content: "ko-KO"}, //Korea
				{content: "und-AE"}, //United Arab Emirates
				{content: "und-AG"}, //Antigua and Barbuda
				{content: "de-DE"}, // Germany
				{content: "fr-FR"}, // France
				{content: "it-IT"}, // Italy
				{content: "es-ES"} // Spain
			]}
		]},
		{kind: 'moon.Divider', content: 'Result'},
		{kind: 'moon.BodyText', name: 'value', content: 'No change yet'}
	],
	changed: function (sender, event) {
		if (this.$.value) {
			this.$.value.setContent(event.name + ' changed to ' + event.value);
		}
	},
	checked: function (sender, event) {
		this.$.picker.set(sender.prop, sender.checked);
	},
	paddingChecked: function (sender, event) {
		this.$.picker.set('digits', sender.checked? 5 : null);
		this.$.picker.render();
	},
	setLocale: function(sender, inEvent) {
		if (ilib) {
			var locale = inEvent.selected.content,
				val = (locale == "Use Default Locale") ? null : locale;
			ilib.setLocale(val);
			this.$.picker.setLocale(val);			
		}
		return true;
	}
});