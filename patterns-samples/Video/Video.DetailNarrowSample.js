enyo.kind({
    name: "moon.sample.video.DetailNarrowSample",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    title: "Movie Name",
    titleAbove: "03",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    components: [
        {
            kind:"moon.Scroller",
            components:[
                {name: "movie", kind: "enyo.Image", classes: "moon-7h moon-8v"},
                {
                    kind:"FittableColumns",
                    components: [
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Rating"},
                            {kind:"moon.BodyText", name: "rating"}
                        ]},
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Release Date"},
                            {kind:"moon.BodyText", name: "releaseDate"}
                        ]},
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Running Time"},
                            {kind:"moon.BodyText", name: "duration"}
                        ]}
                    ]
                },
                {
                    kind:"FittableColumns",
                    components: [
                        {kind: "moon.BodyText", components: [
                            {content: "SD", style:"text-align: center;"},
                            {kind:"moon.Button", name: "valueSD"}
                        ]},
                        {kind: "moon.BodyText", components: [
                            {content: "HD", style:"text-align: center;"},
                            {kind:"moon.Button", name: "valueHD"}
                        ]},
                        {kind: "moon.BodyText", components: [
                            {content: "3D", style:"text-align: center;"},
                            {kind:"moon.Button", name: "value3D"}
                        ]}
                    ]
                }
            ]
        },
        {
            kind: "FittableRows",
            fit: true,
            components: [
                {kind: "moon.Divider", content: "Synopsis"},
                {name: "synopsisHeader", allowHtml: true},
                {tag: "br"},
                {kind: "moon.Scroller", horizontal:"hidden", fit: true, components: [
                    {name: "synopsisBody"}
                ]}
            ]
        }
    ],
    bindings: [
        {from: ".controller.posterUrl", to: ".$.movie.src"},
        {from: ".controller.rating", to: ".$.rating.content"},
        {from: ".controller.releaseDate", to: ".$.releaseDate.content"},
        {from: ".controller.duration", to: ".$.duration.content"},
        {from: ".controller.valueSD", to: ".$.valueSD.content"},
        {from: ".controller.valueHD", to: ".$.valueHD.content"},
        {from: ".controller.value3D", to: ".$.value3D.content"},
        {from: ".controller.synopsisHeader", to: ".$.synopsisHeader.content"},
        {from: ".controller.synopsisBody", to: ".$.synopsisBody.content"}
    ]
});


// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		posterUrl: "http://placehold.it/550x350",
		rating: "PG-13",
		releaseDate: "2013",
		duration: "122",
		valueSD: "$3.99",
		valueHD: "$6.99",
		value3D: "$7.99",
		synopsisHeader: "<b>Starring: </b>Actor Name, Actor Name, and Actor Name",
		synopsisBody: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."
	});

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.video.DetailNarrowSample",
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
