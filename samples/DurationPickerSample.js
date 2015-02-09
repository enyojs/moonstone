enyo.kind({
	name: 'moon.sample.DurationPickerSample',
	kind: 'FittableRows',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: 'moon-7h moon-vspacing-s', components: [
				{kind: 'moon.DurationPicker', name: 'pickerDuration', noneText: 'Pick Duration', content: 'Duration', countdown: true, value: '', template: 'h:m:s', onDurationChange: 'durationChanged', onCountdownExpired: 'countdownExpired'},
				{kind: 'moon.Button', name: 'buttonReset', content: 'Reset Duration', small: true, ontap: 'resetTapped'},
				{kind: 'moon.Button', name: 'countdownToggle', content: 'Toggle Coutdown', small: true, ontap: 'countdownTapped'}
			]}
		]},		
		{kind: 'moon.InputDecorator', components: [
			{kind: 'moon.Input', placeholder: 'h:m:s', name: 'newTemplate'}			
		]},
		{kind: 'moon.Button', name: 'setTemplate', content: 'Set Template', ontap: 'setNewTemplate'},
		{kind: "moon.InputDecorator", components: [
			{kind: "moon.Input", placeholder: '__:__:__', name: 'newValue'}			
		]},
		{kind: 'moon.Button', name: 'setValue', content: 'Set Value', ontap: 'setNewValue'},
		{kind: 'moon.Divider', content:'Result'},
		{kind: 'moon.BodyText', name: 'result', content: 'Duration Picker - Pick Duration'}				
	],
	create: function(){
		this.inherited(arguments);
	},
	durationChanged: function(inSender, inEvent) {
		if (this.$.result && inEvent.value){
			this.$.result.setContent(inEvent.name + ' changed to ' + inEvent.value);
		}
	},
	countdownExpired: function(inSender, inEvent){
		if (this.$.result && inEvent.name){
			this.$.result.setContent(inEvent.name + ' expired');
		}
	},
	resetTapped: function(inSender, inEvent) {
		this.$.pickerDuration.set('value', '');
		this.$.result.setContent('DurationPicker' + ' reset');
		return true;
	},
	countdownTapped: function(inSender, inEvent){
		this.$.pickerDuration.set('countdown', !this.$.pickerDuration.countdown);
	},
	setNewValue: function(){
		this.$.pickerDuration.set('value', this.$.newValue.value);
	},
	setNewTemplate: function(){
		this.$.pickerDuration.set('template', this.$.newTemplate.value);
	}
});