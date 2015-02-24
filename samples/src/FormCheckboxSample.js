var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	FormCheckbox = require('moonstone/FormCheckbox'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.FormCheckboxSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-hspacing', controlClasses: 'moon-5h', components: [
				{components: [
					{kind: Divider, content: 'FormCheckbox Items (Default)'},
					{kind: FormCheckbox, content: 'Option 1', checked: true, onchange: 'itemChanged'},
					{kind: FormCheckbox, content: 'Option 2', onchange: 'itemChanged'},
					{kind: FormCheckbox, disabled: true, content: 'Disabled', onchange: 'itemChanged'},
					{kind: FormCheckbox, content: 'Option 4', checked: true, onchange: 'itemChanged'},
					{kind: FormCheckbox, content: 'This is a verrry long option 5', onchange: 'itemChanged'}
				]},
				{components: [
					{kind: Divider, content: 'FormCheckbox Item (Group)'},
					{kind: Group, onActivate: 'groupChanged', components: [
						{kind: FormCheckbox, content: 'Group Option 1'},
						{kind: FormCheckbox, content: 'Group Option 2', checked: true},
						{kind: FormCheckbox, disabled: true, content: 'Disabled'},
						{kind: FormCheckbox, content: 'Group Option 4'},
						{kind: FormCheckbox, content: 'Group Option 5'}
					]}
				]}
			]}
		]},
		{components: [
			{kind: Divider, content: 'Result'},
			{kind: BodyText, name: 'result', content: 'Nothing selected'}
		]}
	],
	itemChanged: function(inSender, inEvent) {
		this.$.result.setContent(inSender.getContent() + ' was ' + (inSender.getChecked() ? ' selected.' : 'deselected.'));
	},
	groupChanged: function(inSender, inEvent) {
		if (inEvent.toggledControl.getChecked()) {
			var selected = inEvent.toggledControl.getContent();
			this.$.result.setContent(selected + ' was selected.');
		}
	}
});