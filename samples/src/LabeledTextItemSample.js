var
	kind = require('enyo/kind');

var
	Scroller = require('moonstone/Scroller'),
	LabeledTextItem = require('moonstone/LabeledTextItem');

module.exports = kind({
	name: 'moon.sample.LabeledTextItemSample',
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, classes: 'enyo-fill', components: [
			{
				kind: LabeledTextItem,
				label: 'Breaking Bad',
				text: 'A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student'
			},
			{
				kind: LabeledTextItem,
				label: 'South Park',
				text: 'Follows the misadventures of four irreverent grade schoolers in the quiet, dysfunctional town of South Park, Colorado.'
			},
			{
				kind: LabeledTextItem,
				label: 'Paulie',
				text: 'Life from a parrot\'s point of view.'
			}
		]}
	]
});