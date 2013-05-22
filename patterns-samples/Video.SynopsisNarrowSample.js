enyo.kind({
	name: "moon.sample.video.SynopsisNarrowSample",
	kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-video-synopsis",
	fit: true,
	title: "Synopsis",
	titleAbove: "04",
	components: [
		{kind: "enyo.Spotlight"},
		{
			kind: "FittableRows",
			components: [
				{kind: "moon.Divider", classes: "divider", content: "Synopsis"},
				{
					classes: "content",
					components: [
						{
							allowHtml: true,
							content: "<b>Starring: </b>Actor Name, Actor Name, and" +
									 " Actor Name"
						},
						{tag: "br"},
						{
							content: "Pixar genius reigns in this funny romantic c" +
									 "omedy, which stars a robot who says absolute" +
									 "ly nothing for a full 25 minutes yet somehow" +
									 " completely transfixes and endears himself t" +
									 "o the audience within the first few minutes " +
									 "of the film. As the last robot left on earth" +
									 ", Wall-E (voiced by Ben Burtt) is one small " +
									 "robot--with a big, big heart--who holds the " +
									 "future of earth and mankind squarely in the " +
									 "palm of his metal hand. He's outlasted all t" +
									 "he \"Waste Allocation Load Lifter Earth-Clas" +
									 "s \" robots that were assigned some 700 year" +
									 "s ago to clean up the environmental mess tha" +
									 "t man made of earth while man vacationed abo" +
									 "ard the luxury spaceship Axiom."
						}
					]
				}
			]
		}
	]
});
