enyo.kind({
	name: "moon.sample.video.DetailWideSample",
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
			kind: "FittableRows",
			components: [
				{
					name: "movie",
					kind: "enyo.Image",
					classes: "moon-5h moon-2v"
				},
				{
					kind: "HFlexBox",
					components: [
						{flex: true, components: [
							{content: "SD"},
							{name: "valueSD"}
						]},
						{flex: true, components: [
							{content: "HD"},
							{name: "valueHD"}
						]},
						{flex: true, components: [
							{content: "3D"},
							{name: "value3D"}
						]}
					]
				}
			]
		},
		{
			kind: "FittableRows",
			fit: true,
			components: [
				{
					kind: "HFlexBox",
					// TODO: remove this style after scroller is update to handle correctly flex layout's height and width
					style: "height: 100px;",
					components: [
						{flex: true, components: [
							{kind: "moon.Divider", content: "Rating"},
							{name: "rating"}
						]},
						{flex: true, components: [
							{kind: "moon.Divider", content: "Release Date"},
							{name: "releaseDate"}
						]},
						{flex: true, components: [
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
	],
	bindings: [
		{from: ".controller.posterUrl", to: "$.movie.src"},
		{from: ".controller.rating", to: "$.rating.content"},
		{from: ".controller.releaseDate", to: "$.releaseDate.content"},
		{from: ".controller.duration", to: "$.duration.content"},
		{from: ".controller.valueSD", to: "$.valueSD.content"},
		{from: ".controller.valueHD", to: "$.valueHD.content"},
		{from: ".controller.value3D", to: "$.value3D.content"},
		{from: ".controller.synopsisHeader", to: "$.synopsisHeader.content"},
		{from: ".controller.synopsisBody", to: "$.synopsisBody.content"}
	]
});

// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		posterUrl: "http://placehold.it/390x350",
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
				{kind: "enyo.Spotlight"},
				{
					kind: "moon.sample.video.DetailWideSample",
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
