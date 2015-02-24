var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Button = require('moonstone/Button'),
	Divider = require('moonstone/Divider'),
	Input = require('moonstone/Input'),
	InputDecorator = require('moonstone/InputDecorator'),
	Scroller = require('moonstone/Scroller'),
	SimplePicker = require('moonstone/SimplePicker');

module.exports = kind({
	name: 'moon.sample.SimplePickerSample',
	kind: FittableRows,
	classes: 'moon moon-sample-padded enyo-unselectable enyo-fit',
	components:[
		{kind: Scroller, fit: true, components: [
			{kind: Divider, content: 'Picker 1 & 2: Animated'},
			{kind: SimplePicker, name: 'picker1', onChange: 'changed', components: [
				{content: 'San Francisco Airport Terminal Gate 1', active: true},
				{content: 'Boston Airport Terminal Gate 2'},
				{content: 'Tokyo Airport Terminal Gate 3'},
				{content: 'נמל התעופה בן גוריון טרמינל הבינלאומי'}
			]},
			{kind: SimplePicker, name: 'picker2', onChange: 'changed', components: [
				{content: 'Level 1'},
				{content: 'Level 2', active: true},
				{content: 'Level 3'},
				{content: 'Level 4'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Picker 3: Non-animated'},
			{kind: SimplePicker, block: true, name: 'picker3', animate: false, onChange: 'changed', components: [
				{content: 'Hotmail'},
				{content: 'GMail'},
				{content: 'Yahoo Mail', active: true},
				{content: 'AOL Mail'},
				{content: 'Custom IMAP'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Picker 4: Wrapping'},
			{kind: SimplePicker, block: true, name: 'picker4', animate: false, wrap: true, onChange: 'changed', components: [
				{content: 'Mars'},
				{content: 'Venus'},
				{content: 'Earth'},
				{content: 'Mercury'},
				{content: 'Jupiter'},
				{content: 'Saturn'},
				{content: 'Uranus'},
				{content: 'Neptune'},
				{content: 'Pluto'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Picker 5: Disabled'},
			{kind: SimplePicker, block: true, name: 'picker5', disabled: true, components: [
				{content: 'Enyo'},
				{content: 'Sencha'}
			]},
			{classes: 'moon-1v'},

			{kind: Divider, content: 'Picker 6: Hidden'},
			{kind: SimplePicker, name: 'picker6', onChange: 'changed', showing: false, components: [
				{content: 'San Francisco Airport Terminal Gate 1'},
				{content: 'Boston Airport Terminal Gate 2', active: true},
				{content: 'Tokyo Airport Terminal Gate 3'}
			]},
			{kind: Button, content: 'Toggle Showing', small: true, ontap: 'toggleShowing'}
		]},
		{classes: 'moon-1v'},
		{classes: 'moon-hspacing', components: [
			{components: [
				{kind: Divider, content: 'Modify picker: '},
				{kind: SimplePicker, name: 'which', components: [
					{content: '1'},
					{content: '2'},
					{content: '3'},
					{content: '4'},
					{content: '5'},
					{content: '6'}
				]}
			]},
			{components: [
				{kind: Divider, content: 'Add item: '},
				{classes: 'moon-hspacing', components: [
					{kind: InputDecorator, components: [
						{kind: Input, name: 'addInput', placeholder: 'content', classes: 'moon-2h'}
					]},
					{kind: Button, content: 'Add', small: true, ontap: 'addItem'}
				]}
			]},
			{components: [
				{kind: Divider, content: 'Set index: '},
				{classes: 'moon-hspacing', components: [
					{kind: InputDecorator, components: [
						{kind: Input, name: 'changeInput', placeholder: 'index', classes: 'moon-1h'}
					]},
					{kind: Button, content: 'Go', small: true, ontap: 'changeItem'}
				]}
			]},
			{components: [
				{kind: Divider, content: 'Delete current item: '},
				{kind: Button, content: 'Delete', small: true, ontap: 'destroyItem'}
			]}
		]},
		{components: [
			{kind: Divider, content: 'Result'},
			{kind: BodyText, name: 'result', content: 'No change yet'}
		]}
	],
	toggleShowing: function () {
		this.$.picker6.setShowing(!this.$.picker6.showing);
	},
	changed: function (sender, event) {
		this.$.result.setContent(sender.name + ' changed to ' + event.content + ' (' + event.index + ')');
	},
	changeItem: function (sender, event) {
		var picker = this.$['picker' + (this.$.which.getSelectedIndex()+1)];
		var val = parseInt(this.$.changeInput.getValue(),10);
		var len = picker.getClientControls().length - 1;
		if (isNaN(val) || val < 0 || val > len) {
			this.$.result.setContent(picker.name + ' value must be an integer between 0-' + len);
		} else {
			picker.setSelectedIndex(val);
		}
	},
	addItem: function (sender, event) {
		if (!this.$.addInput.getValue()) {
			this.$.result.setContent('Please insert content value.');
			return;
		}
		var picker = this.$['picker' + (this.$.which.getSelectedIndex()+1)];
		picker.createComponent({content:this.$.addInput.getValue()}).render();
		this.$.result.setContent('\'' + this.$.addInput.getValue() + '\' is added to ' + picker.name);
	},
	destroyItem: function (sender, event) {
		var picker = this.$['picker' + (this.$.which.getSelectedIndex()+1)];
		var sel = picker.getSelected();
		if (sel) {
			sel.destroy();
		}
	}
});