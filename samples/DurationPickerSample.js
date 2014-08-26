enyo.kind({
	name: 'moon.sample.DurationPickerSample',
	kind: 'FittableRows',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{classes: 'moon-7h moon-vspacing-s', components: [
				{kind: 'moon.DurationPicker', name: 'pickerDuration', noneText: 'Pick Duration', content: 'Duration', countdown: true, valueHour: 0, valueMinute: 0, valueSecond: 0, template: 'h:m:s', onDurationChange: 'durationChanged', onCountdownExpired: 'countdownExpired'},
				{kind: 'moon.Button', name: 'buttonReset', content: 'Reset Duration', small: true, ontap: 'resetTapped'},
				{kind: 'moon.Button', name: 'countdownToggle', content: 'Toggle Coutdown', small: true, ontap: 'countdownTapped'}
			]}
		]},
		{kind: 'moon.Divider', content:'Result'},
		{kind: 'moon.BodyText', name: 'result'}
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
		this.$.pickerDuration.set('valueHour', '');
		this.$.pickerDuration.set('valueMinute', '');
		this.$.pickerDuration.set('valueSecond', '');

		return true;
	},
	countdownTapped: function(inSender, inEvent){
		this.$.pickerDuration.set('countdown', !this.$.pickerDuration.countdown);
	}
});