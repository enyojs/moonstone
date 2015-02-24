var
	kind = require('enyo/kind'),
	Group = require('enyo/Group');

var
	Scroller = require('moonstone/Scroller'),
	Divider = require('moonstone/Divider'),
	Accordion = require('moonstone/Accordion'),
	SelectableItem = require('moonstone/SelectableItem');

module.exports = kind({
	name: 'moon.sample.AccordionSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, classes: 'enyo-fill moon-8h', components: [
			{kind: Divider, content: 'Not In Group'},
			{components: [
				{kind: Accordion, content: 'This is an accordion', components: [
					{content: 'Item One'},
					{content: 'Item Two'}
				]},
				{kind: Accordion, content: 'Pre-expanded accordion', open:true, components: [
					{content: 'Item Three'},
					{content: 'Item Four'}
				]},
				{kind: Accordion, content: 'This is an lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion', components: [
					{content: 'Looooooooooooooooooooooooooooooooooooong Item One'},
					{content: 'Loooooooooooooooooooooooooooooong Item Two'}
				]},
				{kind: Accordion, content: 'Disabled accordion', disabled: true, components: [
					{content: 'Item One'},
					{content: 'Item Two'}
				]}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'In Group'},
			{kind: Group, highlander:true, components: [
				{kind: Accordion, content: 'This is a grouped accordion', components: [
					{content: 'Item One'},
					{content: 'Item Two'}
				]},
				{kind: Accordion, open:true, content: 'This is another grouped accordion', components: [
					{content: 'Item Three'},
					{content: 'Item Four'}
				]},
				{kind: Accordion, content: 'This is another grouped accordion', components: [
					{content: 'Item Five'},
					{content: 'Item Six'}
				]},
				{kind: Accordion, content: 'This is another lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion', components: [
					{content: 'Looooooooooooooooooooooooooooooooooooong Item Three'},
					{content: 'Loooooooooooooooooooooooooooooong Item Four'}
				]}
			]},
			{classes: 'moon-1v'},
			{kind: Divider, content: 'In Group using Grouped Selectable Items'},
			{kind: Group, groupName: 'menuItems', components: [
				{kind: Group, groupName: 'accordions', highlander:true, components: [
					{kind: Accordion, groupName: 'accordions', content: 'This is a grouped accordion', defaultKind: SelectableItem, components: [
						{content: 'Item One', groupName: 'menuItems'},
						{content: 'Item Two', groupName: 'menuItems'}
					]},
					{kind: Accordion, groupName: 'accordions', open:true, content: 'This is another grouped accordion', defaultKind: SelectableItem, components: [
						{content: 'Item Three', groupName: 'menuItems'},
						{content: 'Item Four', groupName: 'menuItems'}
					]},
					{kind: Accordion, groupName: 'accordions', content: 'This is another grouped accordion', defaultKind: SelectableItem, components: [
						{content: 'Item Five', groupName: 'menuItems'},
						{content: 'Item Six', groupName: 'menuItems'}
					]},
					{kind: Accordion, groupName: 'accordions', content: 'This is another lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng title accordion', defaultKind: SelectableItem, components: [
						{content: 'Looooooooooooooooooooooooooooooooooooong Item Three', groupName: 'menuItems'},
						{content: 'Loooooooooooooooooooooooooooooong Item Four', groupName: 'menuItems'}
					]}
				]}
			]}
		]}
	]
});