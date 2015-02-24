var
	kind = require('enyo/kind');

var
	Divider = require('moonstone/Divider'),
	Item = require('moonstone/Item');

module.exports = kind({
	name: 'moon.sample.DividerSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{classes:'moon-4h', components: [
			{kind: Divider, content: 'Divider 1'},
			{kind: Item, content: 'Item 1'},
			{kind: Item, content: 'Item 2'},
			{kind: Item, content: 'Item 3'},
			{kind: Item, content: 'Item 4'},

			{classes:'moon-1v'}, // Spacer

			{kind: Divider, content: 'Divider 2'},
			{kind: Item, content: 'Item 1'},
			{kind: Item, content: 'Item 2'},

			{classes:'moon-1v'}, // Spacer

			{kind: Divider, content: 'Very Long Divider with truncation'},
			{kind: Item, content: 'Item 1'},
			{kind: Item, content: 'Item 2'}
		]}
	]
});