enyo.kind({
	name: 'moon.sample.SimpleIntegerPickerSample',
	kind: 'FittableRows',
	classes:'moon enyo-unselectable enyo-fit',
	components:[
		{kind: 'moon.Scroller', fit: true, components: [
			{kind: 'moon.Divider', content:'Simple Integer Picker'},
			{kind:'moon.SimpleIntegerPicker', name:'picker1', value:3, min:1, max:10, step: 1, unit: 'sec', onChange: 'change'},

			{kind: 'moon.Divider', content:'Options'},
			{kind: 'moon.FormCheckbox', content: 'Animate', checked: true, prop: 'animate', onchange: 'checked'},
			{kind: 'moon.FormCheckbox', content: 'Wrap', prop: 'wrap', onchange: 'checked'},
			{kind: 'moon.FormCheckbox', content: 'Padding (3 digits)', onchange: 'paddingChecked'},
			{kind: 'moon.FormCheckbox', content: 'Labeled (sec)', checked: true, onchange: 'labelChecked'},
			{kind: 'moon.FormCheckbox', content: 'Disabled', prop: 'disabled', onchange: 'checked'}
		]},
		{kind: 'moon.ToggleButton', content: 'Toggle RTL', ontap: 'buttonTapped'},
		{kind: 'moon.Divider', content:'Result'},
		{kind: 'moon.BodyText', name: 'result', content: 'No action yet.'}
	],
	change: function(inSender, inEvent) {
		this.$.result.setContent(inSender.name + ' changed to ' + inEvent.content + ' (' + inEvent.value + ')');
	},
	buttonTapped: function(inSender, inEvent) {
		if (inSender.getActive()) {
			enyo.Control.prototype.rtl = true;
			enyo.dom.addBodyClass('enyo-locale-right-to-left');
		} else {
			enyo.Control.prototype.rtl = false;
			enyo.dom.removeClass(document.body, 'enyo-locale-right-to-left');
		}
	},
	checked: function(sender, event) {
		this.$.picker1.set(sender.prop, sender.checked);
	},
	paddingChecked: function(sender, event) {
		this.$.picker1.set('digits', sender.checked? 3 : null);
		this.$.picker1.render();
	},
	labelChecked: function(sender, event) {
		this.$.picker1.set('unit', sender.checked? 'sec' : null);
		this.$.picker1.render();
	}
});