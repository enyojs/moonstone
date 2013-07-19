enyo.kind({
    name: "moon.sample.video.SynopsisNarrowSample",
    kind: "moon.Panel",
    title: "Synopsis",
    titleAbove: "04",
    title: "Synopsis",

    components: [
        {
            kind: "FittableRows",
            components: [
                {kind: "moon.Divider", content: "Synopsis"},
                {
                    components: [
                        {
                            name: "synopsisHead",
                            allowHtml: true,
                            content: "<b>Starring: </b>Actor Name, Actor Name, and" +
                                     " Actor Name"
                        },
                        {tag: "br"},
                        {name: "synopsisBody"}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.synopsisHead", to: "$.synopsisHead.content"},
        {from: ".controller.synopsisBody", to: "$.synopsisBody.content"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        synopsisHead: "<b>Starring: </b>Actor Name, Actor Name, and" +
                    " Actor Name",
        synopsisBody: "Pixar genius reigns in this funny romantic c" +
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
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.video.SynopsisNarrowSample",
                    controller: ".app.controllers.movieController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "movieController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});
