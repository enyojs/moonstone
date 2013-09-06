enyo.kind({
    name: "moon.sample.video.DetailWideSample2",
    kind: "moon.Panel",
    title: "Movie Name",
    titleAbove: "03",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png", classes: "moon-video-detail-header-button-right"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png", classes: "moon-video-detail-header-button-right"}
    ],
    components: [
        {kind: "FittableColumns", classes: "enyo-fit", noStretch: true, components: [
            {name: "movie", kind: "enyo.Image", classes: "moon-5h moon-8v"},
            {
                kind: "FittableRows",
                fit: true,
                components: [
                    {
                        components: [
                            {components: [
                                {kind: "moon.Divider", content: "Rating"},
                                {name: "rating"}
                            ]},
                            {components: [
                                {kind: "moon.Divider", content: "Release Date"},
                                {name: "releaseDate"}
                            ]},
                            {components: [
                                {kind: "moon.Divider", content: "Running Time"},
                                {name: "duration"}
                            ]}
                        ]
                    },
                    {tag: "br"},
                    {kind: "moon.Divider", content: "Synopsis"},
                    {name: "synopsisHeader", allowHtml: true},
                    {tag: "br"},
                    {name:"synopsisScroller", kind: "moon.Scroller", horizontal:"hidden", fit: true, components: [
                        {name: "synopsisBody"}
                    ]}
                ]
            },
            {
                kind: "FittableRows",
                style: "width: 25%;",
                components: [
                    {kind: "moon.Divider", classes: "moon-video-detail-more", content: "More"},
                    {kind: "Group", components: [
                        {kind: "moon.SelectableItem", content: "Trailers", spotlight: true},
                        {kind: "moon.SelectableItem", content: "Also Watched", spotlight: true},
                        {kind: "moon.SelectableItem", content: "Recommendations", spotlight: true},
                        {kind: "moon.SelectableItem", content: "Reviews", spotlight: true},
                        {kind: "moon.SelectableItem", content: "Cast", spotlight: true}
                    ]}
                ]
            }
        ]}
    ],
    bindings: [
        {from: ".controller.posterUrl", to: ".$.movie.src"},
        {from: ".controller.rating", to: ".$.rating.content"},
        {from: ".controller.releaseDate", to: ".$.releaseDate.content"},
        {from: ".controller.duration", to: ".$.duration.content"},
        {from: ".controller.synopsisHeader", to: ".$.synopsisHeader.content"},
        {from: ".controller.synopsisBody", to: ".$.synopsisBody.content"}
    ]
});

// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		posterUrl: "http://placehold.it/350x390",
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
					kind: "moon.sample.video.DetailWideSample2",
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
