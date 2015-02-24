var
	kind = require('enyo/kind');

 var
 	FittableRows = require('layout/FittableRows');

 var
 	BodyText = require('moonstone/BodyText'),
 	Divider = require('moonstone/Divider'),
 	IconButton = require('moonstone/IconButton'),
 	InputHeader = require('moonstone/InputHeader'),
 	panel = require('moonstone/panel'),
 	Panels = require('moonstone/Panels');

module.exports = kind({
	name: 'moon.sample.InputHeaderSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit moon-input-header-sample',
	components: [
		{kind: Panels, pattern: 'none', fit: true, components: [
			{
				kind: Panel,
				classes: 'moon-10h',
				headerOptions: {kind: InputHeader, components: [
					{kind: IconButton, icon: 'check'},
					{kind: IconButton, icon: 'arrowlargeright'}
				]},
				onInputHeaderInput: 'handleInput',
				onInputHeaderChange: 'handleChange',
				title:'Input Header',
				titleAbove: '01',
				titleBelow: 'Sub Header',
				subTitleBelow: 'Sub-sub Header'
			},
			{
				kind: Panel,
				classes: 'moon-8h',
				joinToPrev: true,
				headerOptions: {kind: InputHeader, components: [
					{kind: IconButton, icon: 'check'},
					{kind: IconButton, icon: 'arrowlargeright'}
				]},
				onInputHeaderInput: 'handleInput',
				onInputHeaderChange: 'handleChange',
				headerType: 'medium',
				title:'Small Input Header',
				titleAbove: '02',
				titleBelow: 'Sub Header',
				subTitleBelow: 'Sub-sub Header'
			}
		]},
		{kind: Divider, content: 'Result', classes: 'moon-input-header-sample-result'},
		{kind: BodyText, name: 'console', content: 'Input: '}
	],
	handleInput: function (sender, event) {
		this.$.console.setContent('Input: ' + event.originator.getValue());
		return true;
	},
	handleChange: function (sender, event) {
		this.$.console.setContent('Change: ' + event.originator.getValue());
		return true;
	}
});
