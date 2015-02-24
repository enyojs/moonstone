var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	FittableRows = require('layout/FittableRows');

var
	Scroller = require('moonstone/Scroller'),
	CheckboxItem = require('moonstone/CheckboxItem'),
	Divider = require('moonstone/Divider'),
	BodyText = require('moonstone/BodyText');

module.exports = kind({
	name: 'smoon.sample.CheckboxItemSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-hspacing', controlClasses: 'moon-5h', components: [
				{components: [
					{kind: Divider, content: 'Checkbox Items'},
					{kind: CheckboxItem, content: 'Option 1', checked: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'Option 2', onchange: 'itemChanged'},
					{kind: CheckboxItem, disabled: true, content: 'Disabled', onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'Option 4', checked: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'This is a verrry long option 5 with a custom checkmark', icon: '', src: 'assets/icon-button-enyo-logo.png', onchange: 'itemChanged'}
				]},
				{components: [
					{kind: Divider, content: 'Right-Handed Checkbox Items'},
					{kind: CheckboxItem, content: 'Option 1', checked: true, checkboxOnRight: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'Option 2', checkboxOnRight: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, disabled: true, content: 'Disabled', checkboxOnRight: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'Option 4', checked: true, checkboxOnRight: true, onchange: 'itemChanged'},
					{kind: CheckboxItem, content: 'This is a verrry long option 5', checkboxOnRight: true, onchange: 'itemChanged'}
				]},
				{components: [
					{kind: Divider, content: 'Checkbox Item Group'},
					{kind: Group, onActivate: 'groupChanged', components: [
						{kind: CheckboxItem, content: 'Group Option 1'},
						{kind: CheckboxItem, content: 'Group Option 2', checked: true},
						{kind: CheckboxItem, disabled: true, content: 'Disabled'},
						{kind: CheckboxItem, content: 'Group Option 4'},
						{kind: CheckboxItem, content: 'Group Option 5'}
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