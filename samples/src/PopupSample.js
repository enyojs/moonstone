var
	kind = require('enyo/kind');

var
	CardArranger = require('layout/CardArranger'),
	FittableColumns = require('layout/FittableColumns'),
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	Divider = require('moonstone/Divider'),
	FormCheckbox = require('moonstone/FormCheckbox'),
	Item = require('moonstone/Item'),
	Panels = require('moonstone/Panels'),
	Popup = require('moonstone/Popup'),
	Scroller = require('moonstone/Scroller'),
	ToggleButton = require('moonstone/ToggleButton');

module.exports = kind({
	name: 'moon.sample.PopupSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Divider, content: 'Popups'},

		{classes: 'moon-hspacing moon-vspacing-s', components: [
			{kind: Button, content: 'Basic Popup', ontap: 'showPopup', popup: 'basicPopup'},
			{kind: Button, content: 'Direct Popup', ontap: 'showPopup', popup: 'directPopup', direct: true},
			{kind: Button, content: 'Long Popup', ontap: 'showPopup', popup: 'longPopup'}
		]},
		{classes: 'moon-hspacing moon-vspacing-s', components: [
			{kind: Button, content: 'Scroller Popup', ontap: 'showPopup', popup: 'scrollerPopup'},
			{kind: Button, content: 'Button in Popup', ontap: 'showPopup', popup: 'buttonPopup'},
			{kind: Button, content: 'Panels in Popup', ontap: 'showPopup', popup: 'panelsPopup'}
		]},

		{name: 'basicPopup', kind: Popup, content: 'Popup...'},
		// The directPopup only works when we programmatically call 'showDirect' or 'hideDirect'. So, we set autoDismiss as false here.
		{name: 'directPopup', kind: Popup, autoDismiss: false, components: [
			{content: 'Direct Popup'},	
			{kind: Button, content: 'Hide Direct', ontap: 'hidePopup', popup: 'directPopup', direct: true}
		]},
		{name: 'longPopup', kind: Popup, allowHtml: true, content: 'Don\'t go changing, to try and please me  <br>You never let me down before  <br>Don\'t imagine you\'re too familiar  <br>And I don\'t see you anymore  <br>I wouldn\'t leave you in times of trouble  <br>We never could have come this far I took the good times, I\'ll take the bad times I\'ll take you just the way you are Don\'t go trying some new fashion Don\'t change the color of your hair You always have my unspoken passion Although I might not seem to care I don\'t want clever conversation I never want to work that hard I just want someone that I can talk to I want you just the way you are. I need to know that you will always be The same old someone that I knew What will it take till you believe in me The way that I believe in you.'},
		{name: 'scrollerPopup', kind: Popup, components: [
			{kind: Button, content: 'Button Outside Scroller'},
			{kind: Scroller, style: 'height:170px;margin-top:10px;', components: [
				{kind: Item, content: 'Test Item 1'},
				{kind: Item, content: 'Test Item 2'},
				{kind: Item, content: 'Test Item 3'},
				{kind: Item, content: 'Test Item 4'},
				{kind: Item, content: 'Test Item 5'},
				{kind: Item, content: 'Test Item 6'},
				{kind: Item, content: 'Test Item 7'},
				{kind: Item, content: 'Test Item 8'},
				{kind: Item, content: 'Test Item 9'},
				{kind: Item, content: 'Test Item 10'}
			]}
		]},
		{name: 'buttonPopup', kind: Popup, floating: true, components: [
			{kind: Divider, content: 'Buttons in popup example'},
			{classes: 'moon-hspacing', components: [
				{kind: Button, content: 'Hello'},
				{kind: Button, content: 'Goodbye'},
				{kind: ToggleButton, content: 'SpotlightModal', ontap: 'buttonToggled'}
			]}
		]},
		{name: 'panelsPopup', kind: Popup, floating: true, components: [
			{kind: Panels, name: 'panels', defaultKind: FittableRows, arrangerKind: CardArranger, animate:false, classes: 'moon-12v', components: [
				{components: [
					{kind: Divider, content: 'Step 1: Terms of Service'},
					{kind: Scroller, fit: true, spotlightPagingControls: true, horizontal: 'hidden', style: 'margin-bottom:20px;', components: [
						{kind: BodyText, content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
					]},
					{kind: FittableColumns, components: [
						{fit: true, components: [
							{kind: FormCheckbox, content: 'I agree', style: 'display:inline-block;'}
						]},
						{kind: ToggleButton, content: 'SpotlightModal', ontap: 'panelsToggled'},
						{kind: Button, content: 'Sign me Up!', ontap: 'panelNext'}
					]}
				]},
				{components: [
					{kind: Divider, content: 'Step 2'},
					{kind: BodyText, fit: true, content: 'All done.  Thanks for signing up!'},
					{kind: Button, content: 'Previous', ontap: 'panelPrev'}
				]}
			]}
		]}
	],
	popupActivator: null,
	showPopup: function (sender) {
		this.hidePopups();
		var p = this.$[sender.popup];
		if (p) {
			if(sender.direct) {
				p.showDirect();
			} else {
				p.show();
			}
		}
	},
	hidePopup: function (sender) {
		var p = this.$[sender.popup];
		if(p) {
			if(sender.direct) {
				p.hideDirect();
			} else {
				p.hide();
			}
		}
	},
	hidePopups: function () {
		this.$.basicPopup.hide();
		this.$.longPopup.hide();
		this.$.buttonPopup.hide();
	},
	buttonToggled: function (sender, event) {
		this.$.buttonPopup.setSpotlightModal(sender.getActive());
		this.$.buttonPopup.setAutoDismiss(!sender.getActive());
	},
	panelsToggled: function (sender, event) {
		this.$.panelsPopup.setSpotlightModal(sender.getActive());
		this.$.panelsPopup.setAutoDismiss(!sender.getActive());
	},
	panelNext: function () {
		this.$.panels.next();
	},
	panelPrev: function () {
		this.$.panels.previous();
	}
});
