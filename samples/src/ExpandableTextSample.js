var
	kind = require('enyo/kind');

var
	FittableRows = require('layout/FittableRows');

var
	BodyText = require('moonstone/BodyText'),
	Divider = require('moonstone/Divider'),
	ExpandableText = require('moonstone/ExpandableText'),
	Scroller = require('moonstone/Scroller');

module.exports = kind({
	name: 'moon.sample.ExpandableTextSample',
	kind: FittableRows,
	classes: 'moon enyo-unselectable enyo-fit',
	components: [
		{kind: Scroller, fit: true,  components: [
			{kind: Divider, content: '#1: Basic, No Expansion Needed'},
			{kind: ExpandableText, onExpandCollapse: 'collapsedChanged', content: 'Pixar genius reigns in this funny romantic comedy.'},
			{tag: 'br'},
			
			{kind: Divider, content: '#2: Basic'},
			{kind: ExpandableText, onExpandCollapse: 'collapsedChanged', content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.'},
			{tag: 'br'},
			
			{kind: Divider, content: '#3: Collapsed: false'},
			{kind: ExpandableText, onExpandCollapse: 'collapsedChanged', collapsed: false, content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.'},
			{tag: 'br'},
			
			{kind: Divider, content: '#4: MaxLines: 1'},
			{kind: ExpandableText, onExpandCollapse: 'collapsedChanged', maxLines: 1, content: 'Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He\'s outlasted all the \'Waste Allocation Load Lifter Earth-Class\' robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.'}
		]},
		{kind: Divider, content: 'Result'},
		{kind: BodyText, name: 'console', content: 'No change yet'}
	],
	collapsedChanged: function(inSender, inEvent) {
		this.$.console.setContent(inSender.name + (inSender.collapsed ? ' Collapsed' : ' Expanded'));
	}
});