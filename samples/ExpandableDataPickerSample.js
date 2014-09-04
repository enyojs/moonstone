enyo.kind({
	name: 'moon.sample.ExpandableDataPickerSample',
	kind: 'FittableRows',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: 'moon.Scroller', fit: true, components: [
			{name: 'picker', kind: 'moon.ExpandableDataPicker', content: 'Expandable Data Picker', noneText: 'Nothing Selected', components: [
				{bindings: [
					{from: '.model.label', to: '.content'}
				]}
			]},
			{kind: 'moon.Divider', content:'Options'},
			{kind: 'moon.FormCheckbox', content: 'Multiple Selection', prop: 'multipleSelection', onchange: 'checked'},
			{kind: 'moon.FormCheckbox', content: 'Auto Collapse', prop: 'autoCollapseOnSelect', checked: true, onchange: 'checked'}
		]}
	],
	create: enyo.inherit(function (sup) {
		return function () {
			sup.apply(this, arguments);
			this.$.picker.set('collection', new enyo.Collection([
				{label: 'first'},
				{label: 'second'},
				{label: 'third'}
			]));
		};
	}),
	checked: function (sender, event) {
		this.$.picker.set(sender.prop, sender.checked);
	}
});
