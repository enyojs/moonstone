var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	ExpandableInput = require('moonstone/ExpandableInput'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ExpandableInputSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, horizontal: 'hidden', fit: true, components: [
			{classes:'moon-5h', components: [
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Input', noneText: 'No Input'},
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Input with Placeholder', noneText: 'No Input', placeholder: 'Placeholder'},
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Input with Value', noneText: 'No Input', placeholder: 'Placeholder', value: 'Initial value'},
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Disabled Input', noneText: 'No Input', disabled: true, value: 'I am disabled.'},
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Input with loooooooooooooooong text truncation', noneText: 'No Input with loooooooooooooooooong text truncation'},
				{kind: ExpandableInput, oninput:'inputChanging', onChange:'inputChanged', content: 'Input with no value or noneText'}
			]}
		]},
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'console', content: 'Input:', allowHtml: true}
	],
	inputChanging: function(inSender, inEvent) {
		this.$.console.setContent('<em>'+inSender.getContent() + '</em> changing: \'' + inEvent.originator.getValue() + '\'');
	},
	inputChanged: function(inSender, inEvent) {
		this.$.console.setContent('<em>'+inSender.getContent() + '</em> changed to: \'' + inSender.getValue() + '\'');
	}
});
