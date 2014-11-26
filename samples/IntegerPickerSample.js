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
			{kind: 'moon.FormCheckbox', content: 'Disabled', prop: 'disabled', onchange: 'checked'}			
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
	}
});