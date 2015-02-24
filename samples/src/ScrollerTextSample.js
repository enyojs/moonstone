var
	kind = require('enyo/kind');

var
	FittableColumns = require('layout/FittableColumns');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	Divider = require('moonstone/Divider'),
	IconButton = require('moonstone/IconButton'),
	Panel = require('moonstone/Panel'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.ScrollerTextSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Panel, classes: 'enyo-fit', title: 'Text Scrolling Sample', titleBelow: 'Scroller buttons are focusable', headerComponents: [
			{kind: IconButton}
		], components: [
			{kind: Divider, content: 'Terms of Service'},
			{kind: Scroller, fit:true, horizontal: 'hidden', style: 'margin-bottom:20px;', components: [
				{kind: BodyText, name: 'text'}
			]},
			{kind: FittableColumns, noStretch:true, components: [
				{fit:true, components: [
					{kind: ToggleButton, name: 'lengthToggle', content: 'Long Text', value:true},
					{kind: ToggleButton, name: 'spotToggle', content: 'Spot Paging Controls', value:false},
					{kind: ToggleButton, name: 'hideToggle', content: 'Hide Paging Controls when fit', value:false}
				]},
				{kind: Button, content: 'Sign me Up!'}
			]}
		]}
	],
	longText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	shortText: 'The quick brown fox jumped over the lazy dog.',
	bindings: [
		{from: '$.lengthToggle.value', to: '$.text.content', transform: function (val) { return val ? this.longText : this.shortText; } },
		{from: '$.spotToggle.value', to: '$.scroller.spotlightPagingControls' },
		{from: '$.hideToggle.value', to: '$.scroller.hideScrollColumnsWhenFit' }
	]
});
