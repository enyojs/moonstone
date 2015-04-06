var
	kind = require('enyo/kind'),
	utils = require('enyo/utils'),
	Group = require('enyo/Group');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	CaptionDecorator = require('moonstone/CaptionDecorator'),
	Divider = require('moonstone/Divider'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.ToggleButtonSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true, components: [
			{classes: 'moon-toggle-button-sample-wrapper', components: [
				{kind: Divider, content: 'Toggle Buttons: '},
				{kind: ToggleButton, toggleOnLabel: 'wifi is on', toggleOffLabel: 'wifi is off', ontap: 'buttonTapped'},
				{kind: ToggleButton, uppercase: false, toggleOnLabel: 'Internet connected', toggleOffLabel: 'Internet disconnected', ontap: 'buttonTapped'},
				{kind: ToggleButton, disabled: true, toggleOnLabel: 'Disabled Active Button', toggleOffLabel: 'Disabled Inactive Button', ontap: 'buttonTapped'},
				{kind: ToggleButton, disabled: true, value: true, content: 'Disabled Active Button', ontap: 'buttonTapped'},
				{kind: ToggleButton, content: 'Set-top box', ontap: 'buttonTapped'},
				{kind: ToggleButton, small: true, content: 'Small Toggle', ontap: 'buttonTapped'},
				{kind: ToggleButton, small: true, disabled: true, toggleOnLabel: 'Small Disabled Active Button', toggleOffLabel: 'Small Disabled Inactive Button', ontap: 'buttonTapped'},
				{classes: 'moon-1v'},
				{kind: Divider, content: 'Toggle Buttons are set on programmically by default: '},
				{kind: ToggleButton, value: true, toggleOnLabel: 'English', toggleOffLabel: 'Spanish', ontap: 'buttonTapped'},
				{kind: ToggleButton, value: true, content: 'Notifications', ontap: 'buttonTapped'},
				{kind: ToggleButton, small: true, value: true, content: 'Small Button', ontap: 'buttonTapped'},
				{classes: 'moon-1v'},
				{kind: Divider, content: 'Captioned Buttons: '},
				{kind: CaptionDecorator, side: 'top', content: 'Pow', components: [
					{kind: ToggleButton, toggleOnLabel: 'is A', toggleOffLabel: 'not A', ontap: 'buttonTapped'}
				]},
				{kind: CaptionDecorator, side: 'right', content: 'Boom', components: [
					{kind: ToggleButton, toggleOnLabel: 'is B', toggleOffLabel: 'not B', ontap: 'buttonTapped'}
				]},
				{kind: CaptionDecorator, side: 'bottom', content: 'Crash', components: [
					{kind: ToggleButton, toggleOnLabel: 'is C', toggleOffLabel: 'not C', ontap: 'buttonTapped'}
				]},
				{kind: CaptionDecorator, side: 'left', content: 'Bang', components: [
					{kind: ToggleButton, toggleOnLabel: 'is D', toggleOffLabel: 'not D', ontap: 'buttonTapped'}
				]},
				{classes: 'moon-1v'},
				{kind: Divider, content: 'Grouped Buttons: '},
				{kind: Group, classes: 'moon-toggle-button-sample-group', components: [
					{kind: ToggleButton, content: 'Apple', ontap: 'buttonTapped'},
					{kind: ToggleButton, toggleOnLabel: 'Ripened Banana', toggleOffLabel: 'Raw Banana', value: true, ontap: 'buttonTapped'},
					{kind: ToggleButton, toggleOnLabel: 'Sweet Saskatoonberry', toggleOffLabel: 'Bitter Saskatoonberry', ontap: 'buttonTapped'},
					{kind: ToggleButton, small: true, toggleOnLabel: 'Blue Blueberry', toggleOffLabel: 'Red Raspberry', ontap: 'buttonTapped'}
				]}
			]}
		]},
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'notice', content: 'No action yet.'}
	],
	buttonTapped: function (sender, event) {
		var labeltext = sender.get('uppercase') ? utils.toUpperCase(sender.getContent()) : sender.getContent();
		var postString = sender.value ? ' is selected' : ' is unselected';
		if (!sender.toggleOnLabel || !sender.toggleOffLabel) {
			labeltext='\''+labeltext+'\'' + postString;
		} else {
			labeltext='\''+labeltext+'\' selected.';
		}
		this.$.notice.setContent(labeltext);
	}
});
