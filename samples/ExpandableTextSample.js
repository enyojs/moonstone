enyo.kind({
	name: "moon.sample.ExpandableTextSample",
	kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
	components: [
		{kind: "enyo.Spotlight"},
		{fit:true,  components : [
			{kind: "moon.Divider", content: "#1: Basic"},
			{kind: "moon.ExpandableText", onChange: "collapsedChanged", content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."},
			{tag: "br"},
			{kind: "moon.Divider", content: "#2: With 'collapsed: false'"},
			{kind: "moon.ExpandableText", onChange: "collapsedChanged", collapsed: false, content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."},
			{tag: "br"},
			{kind: "moon.Divider", content: "#3: With 'maxLines: 1'"},
			{kind: "moon.ExpandableText", onChange: "collapsedChanged", maxLines: 1, content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."}
		]},
		{kind: "moon.Divider", content: "Result"},
		{name: "console", classes: "moon-input-sample-console", content: "Collapsed: ", allowHtml: true}
	],
	collapsedChanged: function(inSender, inEvent) {
		this.$.console.setContent("Collapsed of " + inSender.name + " : " + inSender.collapsed);
	}
});
