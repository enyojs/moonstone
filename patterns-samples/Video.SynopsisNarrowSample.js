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
            name: "container",
            kind: "FittableColumns",
            classes: "moon-video-detail-container",
            fit: true,
            components: [
                {
                    kind: "FittableRows",
                    components: [
                        {kind: "moon.Divider", classes: "moon-video-detail-devider-synopsis", content: "Synopsis"},
                        {
                            classes: "moon-video-detail-content",
                            components: [
                                {allowHtml: true, content: "<b>Starring: </b>Actor Name, Actor Name, and Actor Name"},
                                {tag: "br"},
                                {
                                    content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
