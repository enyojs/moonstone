var
	kind = require('enyo/kind'),
	hooks = require('enyo/hooks'),
	updateLocale = hooks.updateLocale;

var
	FittableColumns = require('layout/FittableColumns'),
	FittableRows = require('layout/FittableRows');

var
	ilib = require('enyo-ilib');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	Calendar = require('moonstone/Calendar'),
	DatePicker = require('moonstone/DatePicker'),
	Divider = require('moonstone/Divider'),
	ExpandablePicker = require('moonstone/ExpandablePicker'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'smoon.sample.CalendarSample',
	classes: 'moon enyo-unselectable enyo-fit',
	kind: FittableColumns,
	components: [
		{components: [
			{kind: Calendar, name: 'calendar', onChange: 'changed'}
		]},
		{kind: FittableRows, fit: true, components: [
			{kind: Scroller, fit:true, components: [
				{kind: Divider, content: 'Set value: '},
				{classes: 'moon-hspacing', components: [
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'yearInput', classes: 'moon-calendar-sample-input', placeholder: 'Year'}
					]},
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'monthInput', classes: 'moon-calendar-sample-input', placeholder: 'Month'}
					]},
					{kind: InputDecorator, classes: 'moon-2h', components: [
						{kind: Input, name: 'dayInput', classes: 'moon-calendar-sample-input', placeholder: 'Day'}
					]}
				]},
				{classes: 'moon-hspacing', components: [
					{kind: Button, small:true, content: 'Set Date', ontap: 'setDate'},
					{kind: Button, small:true, content: 'Reset to Current', ontap: 'resetDate'}
				]},
				{classes: 'moon-1v'},
				{classes: 'moon-7h', components: [
					{kind: DatePicker, name: 'picker', noneText: 'Pick a Date', content: 'Pick a Date'},
					{kind: ExpandablePicker, name: 'localePicker', noneText: 'No Language Selected', content: 'Choose Locale', onChange: 'setLocale', components: [
						{content: 'Use Default Locale', active: true},
						{content: 'ko-KO'}, //Korea, firstDayOfWeek: 1
						{content: 'zh-TW'},
						{content: 'fa-IR'}, // Iran, persian calendar
						{content: 'th-TH'}, //Thailand
						{content: 'en-US'}, //United States, firstDayOfWeek: 0
						{content: 'und-AE'}, //United Arab Emirates, firstDayOfWeek: 6
						{content: 'und-AG'}, //Antigua and Barbuda, firstDayOfWeek: 0
						{content: 'und-CA'}, //Canada, firstDayOfWeek: 0
						{content: 'it-CH'}, //Italian
						{content: 'en-MX'},
						{content: 'de-DE'}, // Germany, firstDayOfWeek: 1
						{content: 'fr-FR'}, // France, firstDayOfWeek: 1
						{content: 'fr-CA'},
						{content: 'it-IT'}, // Italy, firstDayOfWeek: 1
						{content: 'es-ES'}, // Spain, firstDayOfWeek: 1
						{content: 'es-MX'}
					]},
					{name: 'dowLengthPicker', kind: ExpandablePicker, content: 'Choose DOW Label Length', onChange: 'setLabelLength', components: [
						{content: 'short', active: true},
						{content: 'medium'},
						{content: 'long'},
						{content: 'full'}
					]},
					{name: 'dowLabelClass', kind: ExpandablePicker, content: 'Choose DOW Label Class', onChange: 'setLabelStyle', components: [
						{content: 'Default', active: true, className: ''},
						{content: 'Divider', className: 'moon-divider moon-divider-text'},
						{content: 'Smaller font', className: 'moon-calendar-picker-day small'}
					]}
				]}
			]},
			{kind: Divider, content: 'Result'},
			{kind: BodyText, name: 'result', content: 'No change yet'}
		]}
	],
	bindings: [
		{from: '.$.calendar.value', to: '.$.picker.value', oneWay:false}
	],
	create: function(){
		this.inherited(arguments);
		if (!ilib) {
			this.$.localePicker.hide();
			this.$.dowLengthPicker.hide();
			this.log('iLib not present -- hiding locale & dow length picker');
		} else {
			this.df = new ilib.DateFmt({
				type: 'datetime',
				time: 'hmsa',
				date: 'dmy',
				useNative: false,
				length: 'short'
			});
		}

		if (this.$.localePicker.selected) {
			this.setLocale(null, {selected: this.$.localePicker.selected});
		}
	},

	updateCurrentString: function (date) {
		var formatted = ilib ? this.df.format(date) : date.toDateString();
		this.$.result.setContent('Current Date' + ' changed to ' + formatted);
	},

	setLocale: function(inSender, inEvent){
		if (ilib) {
			var locale = inEvent.selected.content,
				val = (locale == 'Use Default Locale') ? null : locale;
			updateLocale(locale);
			this.$.calendar.setLocale(val);
			this.$.picker.setLocale(val);

			this.df = new ilib.DateFmt({
				type: 'datetime',
				time: 'hmsa',
				date: 'dmy',
				useNative: false,
				length: this.$.dowLengthPicker.selected.content
			});
			this.updateCurrentString(this.$.calendar.getValue());
		}
		return true;
	},
	setLabelLength: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekLength(inEvent.content);
			if (ilib) {
				this.df = new ilib.DateFmt({
					type: 'datetime',
					time: 'hmsa',
					date: 'dmy',
					useNative: false,
					length: inEvent.content
				});
			}
			this.updateCurrentString(this.$.calendar.getValue());
			this.removeLabelItem(this.$.dowLabelClass, inEvent, 'Divider', 'full');
		}
		return true;
	},
	setLabelStyle: function(inSender, inEvent){
		if (inEvent.content){
			this.$.calendar.setDayOfWeekClasses(inEvent.selected.className);
			this.removeLabelItem(this.$.dowLengthPicker, inEvent, 'full', 'Divider');
		}
		return true;
	},
	removeLabelItem: function (inControl, inEvent, inLabelName1, inLabelName2) {
		var i,
			c = inControl.getClientControls();
		for (i = 0; i < c.length; i++) {
			if (c[i].content == inLabelName1) {
				c[i].addRemoveClass('moon-calendar-dow-lable-nodisplay', Boolean(inEvent.content == inLabelName2));
			}
		}
	},
	changed: function(inSender, inEvent) {
		if (this.$.result && inEvent.value) {
			this.updateCurrentString(inEvent.value);
		}
	},
	setDate: function(inSender, inEvent){
		var year = isNaN(parseInt(this.$.yearInput.getValue(), 0)) ? this.$.picker.value.getFullYear() : parseInt(this.$.yearInput.getValue(), 0);
		var month = isNaN(parseInt(this.$.monthInput.getValue(), 0)) ? this.$.picker.value.getMonth() : parseInt(this.$.monthInput.getValue(), 0) - 1;
		var day = isNaN(parseInt(this.$.dayInput.getValue(), 0)) ? this.$.picker.value.getDate() : parseInt(this.$.dayInput.getValue(), 0);
		this.$.calendar.setValue(new Date(year, month, day));
	},
	resetDate: function() {
		this.$.calendar.setValue(null);
	}
});