enyo.kind({
	name: 'moon.sample.DurationPickerSample', components: [
		{kind: 'FittableColumns',
		classes: 'moon enyo-unselectable enyo-fit', components: [
			{kind: 'FittableRows',
			classes: 'moon enyo-unselectable', fit: true,
			components: [
				{kind: 'moon.Divider', content: 'DurationPicker Full Version'},
				{kind: 'moon.Scroller', fit: true, components: [
					{classes: 'moon-7h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDuration', noneText: 'Pick Duration', content: 'Duration', countdown: true,
								value: '10:3:30', template: 'h:m:s', onDurationChange: 'durationChanged', onCountdownExpired: 'countdownExpired'},
						{kind: 'moon.Button', name: 'buttonReset', content: 'Reset Duration', small: true, ontap: 'resetTapped'},
						{kind: 'moon.Button', name: 'countdownToggle', content: 'Toggle Coutdown', small: true, ontap: 'countdownTapped'}
					]}
				]},
				{kind: 'moon.InputDecorator', components: [
					{kind: 'moon.Input', placeholder: 'h:m:s', name: 'newTemplate'}
				]},
				{kind: 'moon.Button', name: 'setTemplate', content: 'Set Template', ontap: 'setNewTemplate', small: true},
				{kind: 'moon.InputDecorator', components: [
					{kind: 'moon.Input', placeholder: '__:__:__', name: 'newValue'}
				]},
				{kind: 'moon.Button', name: 'setValue', content: 'Set Value', ontap: 'setNewValue', small: true},
				{kind: 'moon.Divider', content: 'Result'},
				{kind: 'moon.BodyText', name: 'result', content: 'Duration Picker - Pick Duration'}
			]},
			{kind: 'FittableRows', classes: 'moon enyo-unselectable', components: [
				{kind: 'moon.Divider', content: 'DurationPicker Disabled'},
				{kind: 'moon.Scroller', components: [
					{classes: 'moon-7h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDurationDisabled', disabled: true, noneText: 'Pick Duration', content: 'Duration', countdown: true,
							value: '20:20', template: 'm:s'}
					]}
				]},
				{kind: 'moon.Scroller', fit: true, components: [
					{kind: 'moon.Divider', content: 'DurationPicker Non Editable'},
					{classes: 'moon-7h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDurationNonEdit', disabledPicker: true, noneText: 'Pick Duration', content: 'Duration', countdown: true,
							value: '50', template: 's'}
					]}
				]}
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
	},
	durationChanged: function(sender, ev) {
		if (this.$.result && ev.value) {
			this.$.result.set('content', ev.name + ' changed to ' + ev.value);
		}
	},
	countdownExpired: function(sender, ev) {
		if (this.$.result && ev.name) {
			this.$.result.set('content', ev.name + ' expired');
		}
	},
	resetTapped: function(sender, ev) {
		this.$.pickerDuration.set('value', '');
		this.$.result.set('content', 'DurationPicker - Pick Duration');
		return true;
	},
	countdownTapped: function (sender, ev) {
		this.$.pickerDuration.set('countdown', !this.$.pickerDuration.countdown);
	},
	setNewValue: function () {
		this.$.pickerDuration.set('value', this.$.newValue.value);
	},
	setNewTemplate: function () {
		this.$.pickerDuration.set('template', this.$.newTemplate.value);
	}
});