var
	hooks = require('enyo/hooks'),
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	Scroller = require('moonstone/Scroller'),
	DatePicker = require('moonstone/DatePicker'),
	Button = require('moonstone/Button'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	Divider = require('moonstone/Divider'),
	BodyText = require('moonstone/BodyText');

module.exports = kind({
	name: 'moons.sample.DatePickerSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-7h moon-vspacing-s', components: [
				{kind: DatePicker, name: 'picker', noneText: 'Pick a Date', content: 'Date', onChange: 'changed'},
				{kind: Button, name: 'buttonReset', content: 'Reset Date', small: true, ontap: 'resetTapped'},
				{kind: DatePicker, name: 'disabledPicker', disabled: true, noneText: 'Disabled Date Picker', content: 'Disabled Date'},
				{classes: 'moon-hspacing', components: [
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'yearInput', classes: 'moon-date-picker-sample-input', placeholder: 'Year'}
					]},
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'monthInput', classes: 'moon-date-picker-sample-input', placeholder: 'Month'}
					]},
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'dayInput', classes: 'moon-date-picker-sample-input', placeholder: 'Day'}
					]}
				]},
				{classes: 'moon-hspacing', components: [
					{kind: Button, small: true, content: 'Set Date', ontap: 'setDate'},
					{kind: Button, small: true, content: 'Reset to Current', ontap: 'resetDate'}
				]},
				{name: 'localePicker', kind: ExpandablePicker, noneText: 'No Locale Selected', content: 'Choose Locale', onChange: 'setLocale', components: [
					{content: 'Use Default Locale', active: true},
					{content: 'ko-KR'},
					{content: 'zh-TW'},
					{content: 'fa-IR'},
					{content: 'ar-SA'},
					{content: 'ur-IN'},
					{content: 'th-TH'},	//Thailand
					{content: 'en-US'},
					{content: 'jp-JP'},
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
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'result', content: 'No change yet'}
	],
	create: function(){
		this.inherited(arguments);
		if (!window.ilib) {
			this.$.localePicker.hide();
			this.log('iLib not present -- hiding locale picker');
		}
	},
	setLocale: function(inSender, inEvent){
		if (window.ilib) {
			var locale = inEvent.selected.content,
				val = (locale == 'Use Default Locale') ? null : locale;
			hooks.updateLocale(locale);
			this.$.picker.setLocale(val);
			this.$.disabledPicker.setLocale(val);
		}
		return true;
	},
	setDate: function() {
		var current = this.$.picker.value || new Date();
		var year = isNaN(parseInt(this.$.yearInput.getValue(), 0)) ? current.getFullYear() : parseInt(this.$.yearInput.getValue(), 0);
		var month = isNaN(parseInt(this.$.monthInput.getValue(), 0)) ? current.getMonth() : parseInt(this.$.monthInput.getValue(), 0) - 1;
		var day = isNaN(parseInt(this.$.dayInput.getValue(), 0)) ? current.getDate() : parseInt(this.$.dayInput.getValue(), 0);
		this.$.picker.setValue(new Date(year, month, day));
	},
	resetDate: function() {
		this.$.picker.setValue(new Date());
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + ' changed to ' + inEvent.value.toDateString());
		}
	},
	resetTapped: function(inSender, inEvent) {
		this.$.picker.set('value', null);
		return true;
	}
});