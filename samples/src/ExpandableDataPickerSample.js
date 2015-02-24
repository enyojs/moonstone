var
	kind = require('enyo/kind'),
	Collection = require('enyo/Collection');

var
	FittableRows = require('layout/FittableRows');

var
	Divider = require('moonstone/Divider'),
	ExpandableDataPicker = require('moonstone/ExpandableDataPicker'),
	FormCheckbox = require('moonstone/FormCheckbox'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ExpandableDataPickerSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{name: 'picker', kind: ExpandableDataPicker, content: 'Expandable Data Picker', noneText: 'Nothing Selected', components: [
				{bindings: [
					{from: '.model.label', to: '.content'}
				]}
			]},
			{kind: Divider, content:'Options'},
			{kind: FormCheckbox, content: 'Multiple Selection', prop: 'multipleSelection', onchange: 'checked'},
			{kind: FormCheckbox, content: 'Auto Collapse', prop: 'autoCollapseOnSelect', checked: true, onchange: 'checked'}
		]}
	],
	create: function () {
		FittableRows.prototype.create.apply(this, arguments);
		this.$.picker.set('collection', new Collection([
			{label: 'first'},
			{label: 'second'},
			{label: 'third'}
		]));
	},
	checked: function (sender, event) {
		this.$.picker.set(sender.prop, sender.checked);
	}
});
