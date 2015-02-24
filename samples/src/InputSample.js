var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	Icon = require('moonstone/Icon'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	RichText = require('moonstone/RichText'),
	Scroller = require('moonstone/Scroller'),
	TextArea = require('moonstone/TextArea');

module.exports = kind({
	name: 'moon.sample.InputSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit moon-input-sample',
	components: [
		{kind: Divider, content: 'Inputs'},
		{kind: Scroller, horizontal: 'hidden', fit: true, components: [
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'JUST TYPE', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Search term', oninput: 'handleInput', onchange: 'handleChange'},
				{kind: Icon, icon: 'search'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, type: 'password', placeholder: 'Enter password', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, type: 'number', placeholder: 'Enter number', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Placeholder for initial value', value: 'This is the initial value', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Placeholder for value with ellipsis', value: 'This is the initial value that is of a certain length to display an ellipsis.', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Dismiss on Enter', dismissOnEnter:true, oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, disabled: true, components: [
				{kind: Input, disabled: true, placeholder: 'Disabled input'}
			]},

			{kind: Divider, content: 'TextAreas'},
			{kind: InputDecorator, components: [
				{kind: TextArea, placeholder: 'Enter text here', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: TextArea, placeholder: 'JUST TYPE', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, disabled: true, components: [
				{kind: TextArea, disabled: true, placeholder: 'Deactivated TextArea', oninput: 'handleInput', onchange: 'handleChange'}
			]},

			{kind: Divider, content: 'RichTexts'},
			{kind: InputDecorator, components: [
				{kind: RichText, oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: RichText, style: 'width: 240px;', oninput: 'handleInput', onchange: 'handleChange'},
				{kind: Icon, icon: 'search'}
			]},
			{kind: InputDecorator, disabled: true, components: [
				{kind: RichText, disabled: true, style: 'width: 240px;'}
			]}
		]},
		{kind: Divider, content: 'Result', classes: 'moon-input-sample-result'},
		{kind: BodyText, name: 'console', allowHtml: false, content: 'Input: '},
		{kind: Divider, content: 'Bottom-aligned inputs', classes: 'moon-input-sample-result'},
		{components: [
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Bottom', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Aligned', oninput: 'handleInput', onchange: 'handleChange'}
			]},
			{kind: InputDecorator, components: [
				{kind: Input, placeholder: 'Inputs', oninput: 'handleInput', onchange: 'handleChange'}
			]}
		]}
	],
	handleInput: function (sender, event) {
		this.$.console.setContent('Input: ' + sender.getValue());
	},
	handleChange: function (sender, event) {
		this.$.console.setContent('Changed: ' + sender.getValue());
	}
});
