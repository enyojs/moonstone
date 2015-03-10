enyo.kind({
	name: 'moon.sample.DurationPickerSample', components: [
		{kind: 'FittableColumns',
		classes: 'moon enyo-unselectable enyo-fit', components: [
			{kind: 'FittableRows',
			classes: 'moon enyo-unselectable', fit: true,
			components: [
				{kind: 'moon.Divider', content: 'DurationPicker'},
				{kind: 'moon.Scroller', fit: true, components: [
					{classes: 'moon-6h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDuration',
							noneText: 'Pick Duration',
							content: 'Duration',
							value: '10:1:5', 
							template: 'm:h:s',
							enableTimer: true,
							onDurationChange: 'durationChanged',
							onPickerExpired: 'pickerExpired'
						}
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
				{kind: 'moon.BodyText', name: 'result', content: 'Duration Picker set to Pick Duration'}
			]},
			{kind: 'FittableRows', classes: 'moon enyo-unselectable', components: [
				{kind: 'moon.Divider', content: 'DurationPicker Disabled'},
				{kind: 'moon.Scroller', components: [
					{classes: 'moon-7h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDurationDisabled', disabled: true, noneText: 'Pick Duration', content: 'Duration',
							value: '20:20', template: 'm:s'}
					]}
				]},
				{kind: 'moon.Scroller', fit:true, components: [
					{kind: 'moon.Divider', content: 'DurationPicker without Timer'},
					{classes: 'moon-7h moon-vspacing-s', components: [
						{kind: 'moon.DurationPicker', name: 'pickerDurationNonTimer', enableTimer: false, noneText: 'Pick Duration', content: 'Duration',
							value: '30:5:2', template: 'smh'}
					]}
				]}
			]}
		]}
	],
	create: function () {
		this.inherited(arguments);
	},
	durationChanged: function (sender, ev) {
		if (this.$.result && ev.value) {
			this.$.result.set('content', ev.name + ' changed to ' + ev.value);
		}
	},
	pickerExpired: function (sender, ev) {
		if (this.$.result && ev.name) {
			this.$.result.set('content', ev.name + ' expired');
		}
	},
	setNewValue: function () {
		this.$.pickerDuration.set('value', this.$.newValue.value);
	},
	setNewTemplate: function () {
		this.$.pickerDuration.set('template', this.$.newTemplate.value);
	}
});