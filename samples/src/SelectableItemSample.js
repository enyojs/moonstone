var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	FittableRows = require('layout/FittableRows');

var
	Scroller = require('moonstone/Scroller'),
	Divider = require('moonstone/Divider'),
	SelectableItem = require('moonstone/SelectableItem');

module.exports = kind({
	name: 'moon.sample.SelectableItemSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-hspacing', controlClasses: 'moon-5h', components: [
				{components: [
					{kind: Divider, content: 'Selectable Items'},
					{kind: SelectableItem, content: 'Option 1', selected: true, onActivate: 'itemChanged'},
					{kind: SelectableItem, content: 'Option 2', onActivate: 'itemChanged'},
					{kind: SelectableItem, disabled: true, content: 'Disabled', onActivate: 'itemChanged'},
					{kind: SelectableItem, content: 'Option 4', selected: true, onActivate: 'itemChanged'},
					{kind: SelectableItem, content: 'Option 5 is very very very long', onActivate: 'itemChanged'}
				]},
				{components: [
					{kind: Divider, content: 'Selectable Item Group'},
					{kind: Group, onActivate: 'groupChanged', components: [
						{kind: SelectableItem, content: 'Group Option 1'},
						{kind: SelectableItem, content: 'Group Option 2'},
						{kind: SelectableItem, disabled: true, content: 'Disabled'},
						{kind: SelectableItem, content: 'Group Option 4'},
						{kind: SelectableItem, content: 'Group Option 5', selected: true}
					]}
				]},
				{components: [
					{kind: Group, onActivate: 'groupChanged', components: [
						{kind: Divider, content: 'Selectable Items with long text truncation'},
						{kind: SelectableItem, content: 'Option 1 with long text truncation', onActivate: 'itemChanged'},
						{kind: SelectableItem, content: 'Option 2 with long text truncation', onActivate: 'itemChanged'},
						{kind: SelectableItem, disabled: true, content: 'Disabled', onActivate: 'itemChanged'},
						{kind: SelectableItem, content: 'Option 4 with long text truncation', selected: true, onActivate: 'itemChanged'},
						{kind: SelectableItem, content: 'Option 5 with long text truncation', onActivate: 'itemChanged'}
					]}
				]}
			]}
		]},
		{components: [
			{kind: Divider, content: 'Result'},
			{name: 'result', content: 'Nothing selected'}
		]}
	],
	itemChanged: function (sender, event) {
		if (!this.hasNode()) {
			return;
		}
		this.$.result.setContent(sender.getContent() + ' was ' + (sender.getActive() ? ' selected.' : 'deselected.'));
	},
	groupChanged: function (sender, event) {
		if (event.originator.getActive()) {
			var selected = event.originator.getContent();
			this.$.result.setContent(selected + ' was selected.');
		}
	}
});