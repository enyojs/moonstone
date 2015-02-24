var
	kind = require('enyo/kind');

var
	IconButton = require('moonstone/IconButton'),
	Item = require('moonstone/Item'),
	Panels = require('moonstone/Panels'),
	Tooltip = require('moonstone/Tooltip'),
	TooltipDecorator = require('moonstone/TooltipDecorator');

module.exports = kind({
	name: 'moon.sample.AlwaysViewingPanelsSample',
	classes: 'moon enyo-fit enyo-unselectable',
	style: 'background: gray url(\'http://lorempixel.com/1920/1080/\')',
	components: [
		{name: 'panels', kind: Panels, pattern: 'alwaysviewing', classes: 'enyo-fit', useHandle: false, components: [
			{title: 'First Panel', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Second Panel', titleBelow: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', subTitleBelow: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', headerComponents: [
				{kind: TooltipDecorator, components: [
					{kind: Tooltip, content: 'Tooltip', position: 'above'},
					{kind: IconButton}
				]}
			], components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Third Panel', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Fourth', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Fifth', joinToPrev: true, titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Sixth', titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One', ontap: 'next'},
				{kind: Item, content: 'Item Two', ontap: 'next'},
				{kind: Item, content: 'Item Three', ontap: 'next'},
				{kind: Item, content: 'Item Four', ontap: 'next'},
				{kind: Item, content: 'Item Five', ontap: 'next'}
			]},
			{title: 'Seventh', joinToPrev: true, titleBelow: 'Sub-title', subTitleBelow: 'Sub-sub title', classes: 'moon-7h', components: [
				{kind: Item, content: 'Item One'},
				{kind: Item, content: 'Item Two'},
				{kind: Item, content: 'Item Three'},
				{kind: Item, content: 'Item Four'},
				{kind: Item, content: 'Item Five'}
			]}
		]}
	],
	next: function(inSender, inEvent) {
		this.$.panels.next();
		return true;
	}
});