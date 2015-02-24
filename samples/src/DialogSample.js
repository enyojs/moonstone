var
	kind = require('enyo/kind');

var
	Divider = require('moonstone/Divider'),
	Button = require('moonstone/Button'),
	ToggleButton = require('moonstone/ToggleButton'),
	Dialog = require('moonstone/Dialog');

module.exports = kind({
	name: 'moons.sample.DialogSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Divider, content: 'Dialog'},
		{kind: Button, content: 'Open Dialog', ontap: 'showDialog'},
		{classes: 'moon-1v'},
		{kind: ToggleButton, content: 'Showing', name: 'showingToggle'},
		{kind: ToggleButton, content: 'Animate', name: 'animateToggle'},
		{kind: ToggleButton, content: 'SpotlightModal', ontap: 'buttonToggled'},
		{
			name: 'dialog', 
			kind: Dialog,
			title: 'You\'ve been watching TV for a very long time so let\'s do a quick check-in.',
			subTitle: 'This TV has been active for 10 hours.',
			message: 'Perhaps it is time to take a break and get some fresh air. There is a nice coffee shop around the corner', 
			components: [
				{kind: Button, content: 'Go get a coffee', ontap: 'hideDialog'},
				{kind: Button, content: 'Keep watching TV', ontap: 'addMessage'}
			]
		}
	],
	bindings: [
		{from: '.$.showingToggle.value', to: '.$.dialog.showing', oneWay:false},
		{from: '.$.dialog.animate', to: '.$.animateToggle.value', oneWay:false}
	],
	buttonToggled: function(sender, event) {
		this.$.dialog.setSpotlightModal(sender.getActive());
		this.$.dialog.setAutoDismiss(!sender.getActive());
	},
	showDialog: function(sender) {
		this.$.dialog.show();
	},
	hideDialog: function(sender, event) {
		this.$.dialog.hide();
	},
	addMessage: function() {
		this.$.dialog.setMessage(this.$.dialog.getMessage() + '<br> No, seriously, you should probably take a break.');
	}
});