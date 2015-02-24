var
	kind = require('enyo/kind'),
	Repeater = require('enyo/Repeater');

var
	FittableRows = require('layout/FittableRows');

var
	Divider = require('moonstone/Divider'),
	Scroller = require('moonstone/Scroller'),
	ImageItem = require('moonstone/ImageItem'),
	IconButton = require('moonstone/IconButton'),
	ObjectActionDecorator = require('moonstone/ObjectActionDecorator'),
	BodyText = require('moonstone/BodyText')

module.exports = kind({
	name: 'moon.sample.ObjectActionHorizontalTypeSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	handlers: {
		ontap: 'ontap'
	},
	components: [
		{kind: Divider, content: 'Object Action: horizontal Type Sample'},
		{kind: Scroller, fit: true, components: [
			{kind: Repeater, count:20, onSetupItem: 'setupItem', components: [
				{kind: ObjectActionDecorator, orientation: 'horizontal', components: [
					{kind: ImageItem, source: 'assets/default-music.png'}
				], actionComponents: [
					{kind: IconButton, name: 'Icon1'},
					{kind: IconButton, name: 'Icon2'},
					{kind: IconButton, name: 'Icon3'}
				]}
			]}
		]},
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'result', content: 'No item tapped yet.'}
	],
	setupItem: function (sender, event) {
		event.item.$.imageItem.setSource('http://placehold.it/200x300/' + Math.floor(Math.random()*0x1000000).toString(16) + '/ffffff&text=Image ' + event.index);
		event.item.$.imageItem.setText('Item ' + event.index + ': Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
	},
	ontap: function (sender, event) {
		this.$.result.setContent(event.originator.name + ' tapped.');
	}
});


