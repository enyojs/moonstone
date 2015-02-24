var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	Scroller = require('moonstone/Scroller'),
	ToggleItem = require('moonstone/ToggleItem');

module.exports = kind({
	name: 'moon.sample.ToggleItemSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-hspacing', controlClasses: 'moon-5h', components: [
				{components: [
					{kind: Divider, content: 'Toggle Items'},
					{kind: ToggleItem, content: 'Option 1', checked: true, onchange: 'itemChanged'},
					{kind: ToggleItem, content: 'Option 2', onchange: 'itemChanged'},
					{kind: ToggleItem, disabled: true, content: 'Disabled', onchange: 'itemChanged'},
					{kind: ToggleItem, disabled: true, checked: true, content: 'Disabled Checked'},
					{kind: ToggleItem, content: 'Option 4', checked: true, onchange: 'itemChanged'},
					{kind: ToggleItem, content: 'This is a verrry long option 5', onchange: 'itemChanged'}
				]},
				{components: [
					{kind: Divider, content: 'Toggle Item Group'},
					{kind: Group, onActivate: 'groupChanged', components: [
						{kind: ToggleItem, content: 'Group Option 1'},
						{kind: ToggleItem, content: 'Group Option 2', checked: true},
						{kind: ToggleItem, disabled: true, content: 'Disabled'},
						{kind: ToggleItem, content: 'Group Option 4'},
						{kind: ToggleItem, content: 'Group Option 5'}
					]}
				]}
			]}
		]},
		{components: [
			{kind: Divider, content: 'Result'},
			{kind: BodyText, name: 'result', content: 'Nothing selected'}
		]}
	],
	itemChanged: function (sender, event) {
		this.$.result.setContent(sender.getContent() + ' is ' + (sender.getChecked() ? ' selected.' : 'deselected.'));
	},
	groupChanged: function (sender, event) {
		if (event.toggledControl.getChecked()) {
			var selected = event.toggledControl.getContent();
			this.$.result.setContent(selected + ' is selected.');
		}
	}
});