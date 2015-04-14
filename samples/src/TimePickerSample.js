var
	hooks = require('enyo/hooks'),
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	ilib = require('enyo-ilib');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	DatePicker = require('moonstone/DatePicker'),
	Divider = require('moonstone/Divider'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	Scroller = require('moonstone/Scroller'),
	TimePicker = require('moonstone/TimePicker');

module.exports = kind({
	name: 'moon.sample.TimePickerSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-7h moon-vspacing-s', components: [
				{kind: DatePicker, name: 'pickerDateLinked', noneText: 'Pick a Date', content: 'Linked Date', onChange: 'dateChanged'},
				{kind: TimePicker, name: 'pickerTimeLinked', noneText: 'Pick a Time', content: 'Linked Time', meridiemEnable: true, onChange: 'timeChanged'},
				{kind: TimePicker, name: 'pickerTime', noneText: 'Pick a Time', content: 'Time', meridiemEnable: true, onChange: 'timeChanged'},
				{kind: Button, name: 'buttonReset', content: 'Reset Time', small: true, ontap: 'resetTapped'},
				{kind: TimePicker, name: 'pickerDisabled', meridiemEnable: true, disabled: true, noneText: 'Disabled Time Picker', content: 'Disabled Time'},
				{kind: ExpandablePicker, name: 'pickerLocale', noneText: 'No Locale Selected', content: 'Choose Locale', onChange: 'setLocale', components: [
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
	bindings: [
		{from: '.value', to: '.$.pickerDateLinked.value', oneWay:false},
		{from: '.value', to: '.$.pickerTimeLinked.value', oneWay:false}
	],
	create: function (){
		FittableRows.prototype.create.apply(this, arguments);
		if (!ilib) {
			this.$.pickerLocale.hide();
			this.log('iLib not present -- hiding locale picker');
		}
		this.set('value', new Date('Mar 09 2014 01:59'));
	},
	setLocale: function (sender, event){
		if (ilib) {
			var locale = event.selected.content,
				val = (locale == 'Use Default Locale') ? null : locale;
			hooks.updateLocale(locale);
			this.$.pickerDateLinked.setLocale(val);
			this.$.pickerTimeLinked.setLocale(val);
			this.$.pickerTime.setLocale(val);
			this.$.pickerDisabled.setLocale(val);
			this.$.result.setContent('locale changed to ' + locale);
		}
		return true;
	},
	timeChanged: function (sender, event) {
		if (this.$.result && event.value){
			var timeArray = event.value.toTimeString().split(': ');
			this.$.result.setContent(event.name + ' changed to ' + timeArray[0] + ': ' + timeArray[1]);
		}
	},
	dateChanged: function (sender, event) {
		if (this.$.result && event.value){
			this.$.result.setContent(event.name + ' changed to ' + event.value.toDateString());
		}
	},
	resetTapped: function (sender, event) {
		this.$.pickerTime.set('open', false);
		this.$.pickerTime.set('value', null);
		return true;
	}
});