enyo.kind({
	name: "moon.sample.MoreLessDecoratorSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{fit:true,  components : [
			{kind: "moon.Divider", content: "#1: With 'HightlightText' component"},
			{kind: "moon.MoreLessDecorator", nameonChange: "collapsedChanged", components: [
				{kind: "moon.HighlightText", highlight: "Pixar genius reigns in this funny romantic comedy,", content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."}
			]},
			{tag: "br"},
			{kind: "moon.Divider", content: "#2: With 'collapsed: false'"},
			{kind: "moon.MoreLessDecorator", onChange: "collapsedChanged", collapsed: false, components: [
				{content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."}
			]},
			{tag: "br"},
			{kind: "moon.Divider", content: "#3: With 'lineClamp: 1'"},
			{kind: "moon.MoreLessDecorator", onChange: "collapsedChanged", lineClamp: 1, components: [
				{content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."}
			]}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "console", classes: "moon-input-sample-console", content: "Collapsed: ", allowHtml: true}
	],
	collapsedChanged: function(inSender, inEvent) {
		this.$.console.setContent("Collapsed of " + inSender.name + " : " + inSender.collapsed);
	}
});
