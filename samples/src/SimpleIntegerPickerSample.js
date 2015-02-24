var
	kind = require('enyo/kind'),
	dom = require('enyo/dom'),
	Control = require('enyo/Control');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	FormCheckbox = require('moonstone/FormCheckbox'),
	Scroller = require('moonstone/Scroller'),
	SimpleIntegerPicker = require('moonstone/SimpleIntegerPicker'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.SimpleIntegerPickerSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components:[
		{kind: Scroller, fit: true, components: [
			{kind: Divider, content: 'Simple Integer Picker'},
			{kind: SimpleIntegerPicker, name: 'picker1', value:3, min:-10, max:10, step: 1, unit: 'sec', onChange: 'change'},

			{kind: Divider, content: 'Options'},
			{kind: FormCheckbox, content: 'Animate', checked: true, prop: 'animate', onchange: 'checked'},
			{kind: FormCheckbox, content: 'Wrap', prop: 'wrap', onchange: 'checked'},
			{kind: FormCheckbox, content: 'Padding (3 digits)', onchange: 'paddingChecked'},
			{kind: FormCheckbox, content: 'Labeled (sec)', checked: true, onchange: 'labelChecked'},
			{kind: FormCheckbox, content: 'Disabled', prop: 'disabled', onchange: 'checked'}
		]},
		{kind: ToggleButton, content: 'Toggle RTL', ontap: 'buttonTapped'},
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'result', content: 'No action yet.'}
	],
	change: function (sender, event) {
		this.$.result.setContent(sender.name + ' changed to ' + event.content + ' (' + event.value + ')');
	},
	buttonTapped: function (sender, event) {
		if (sender.getActive()) {
			Control.prototype.rtl = true;
			dom.addBodyClass('enyo-locale-right-to-left');
		} else {
			Control.prototype.rtl = false;
			dom.removeClass(document.body, 'enyo-locale-right-to-left');
		}
	},
	checked: function (sender, event) {
		this.$.picker1.set(sender.prop, sender.checked);
	},
	paddingChecked: function (sender, event) {
		this.$.picker1.set('digits', sender.checked? 3 : null);
		this.$.picker1.render();
	},
	labelChecked: function (sender, event) {
		this.$.picker1.set('unit', sender.checked? 'sec' : null);
		this.$.picker1.render();
	}
});