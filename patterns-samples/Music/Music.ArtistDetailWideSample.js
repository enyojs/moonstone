// Sample view

enyo.kind({
	name: "moon.sample.music.ArtistDetailWideSample",
	kind: "moon.Panel",
	titleAbove: "04",
	title: "Artist",
	titleBelow: "Artist Name",
	layoutKind: "FittableColumnsLayout",
	headerComponents: [
		{kind: "moon.IconButton", src: "../assets/icon-like.png"},
		{kind: "moon.IconButton", src: "../assets/icon-next.png"}
	],
	components: [
		{
			kind: "moon.Scroller",
			classes: "moon-6h",
			components: [
				{ 
					kind:"moon.BodyText",
					components: [
						{
							name: "artistImage",
							kind: "enyo.Image",
							classes: "moon-5h moon-8v"
						},
						{
							kind: "moon.Table",
							classes: "enyo-table-fit",
							components: [
								{
									components: [
										{content: "Organized", classes: "moon-large-button-text"},
										{name: "organized"}
									]
								},
								{
									components: [
										{content: "Debut", classes: "moon-large-button-text"},
										{name: "debut"}
									]
								},
								{
									components: [
										{content: "Type", classes: "moon-large-button-text"},
										{name: "type"}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			kind: "FittableRows",
			fit: true,
			components: [
				{kind: "moon.Divider", content: "Bio"},
				{
					kind: "moon.Scroller",
					horizontal: "hidden",
					fit: true,
					components: [
						{name: "bio", kind:"moon.BodyText", allowHtml: true}
					]
				}
			]
		},
		{
			kind: "FittableRows",
			classes: "moon-6h",
			components: [
				{kind: "moon.Divider", content: "Related Artists"},
				{
					name: "relatedArtists",
					kind: "moon.DataGridList",
					classes: "moon-4v",
					spacing: 10,
					components: [
						{kind: "moon.GridListImageItem", bindings: [
							{from: ".model.relatedUrl", to: ".source"}
						]}
					]
				},
				{kind: "moon.Divider", content: "Top 10 Tracks"},
				{
					name: "trackInfo",
					kind: "moon.DataList",
					fit: true,
					components: [
						{
							bindings: [
								{from: ".model.coverUrl", to: ".$.enyoImage.src"},
								{from: ".model.title", to: ".$.imageTitle.content"},
								{from: ".model.artist", to: ".$.imageArtist.content"},
								{from: ".model.duration", to: ".$.imageDuration.content"}
							],
							components: [
								{kind: "moon.Item", ontap: "changeName", layoutKind: "FittableColumnsLayout", components: [
									{name: "enyoImage", kind: "enyo.Image", style: "width: 170px; height: 126px; padding-right: 30px;"},
									{components: [
										{name: "imageTitle"},
										{name: "imageArtist", classes: "moon-superscript"},
										{name: "imageDuration", classes: "moon-superscript"}
									]}
								]}
							]
						}
					]
				}
			]
		}
	],
	bindings: [
		{from: ".controller.artist", to: ".$.artist.content"},
		{from: ".controller.artistImageUrl", to: ".$.artistImage.src"},
		{from: ".controller.organized", to: ".$.organized.content"},
		{from: ".controller.debut", to: ".$.debut.content"},
		{from: ".controller.type", to: ".$.type.content"},
		{from: ".controller.bio", to: ".$.bio.content"},
		{from: ".controller.related", to: ".$.relatedArtists.controller"},
		{from: ".controller.tracks", to: ".$.trackInfo.controller"}
	]
});


// Sample model

enyo.ready(function(){
	var sampleModel = new enyo.Model({
		artist: "Paul McCartney",
		artistImageUrl: "../assets/default-music-big.png",
		organized: "5 April 2013",
		debut: "5 April 1973",
		type: "Solo",
		bio: "Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of",
		related: new enyo.Collection([
			{relatedUrl: "../assets/default-music.png"},
			{relatedUrl: "../assets/default-music.png"},
			{relatedUrl: "../assets/default-music.png"}
		]),
		tracks: new enyo.Collection([
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
			{coverUrl: "../assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"}
		])

	});

//  Application to render sample

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.sample.music.ArtistDetailWideSample",
					controller: ".app.controllers.artistController",
					classes: "enyo-fit"
				}
			]
		},
		controllers: [
			{
				name: "artistController",
				kind: "enyo.ModelController",
				model: sampleModel,
				changeTrackName: function(inSender, inEvent) {
					inSender.parent.controller.set("name", "We are the Champions");
				}
			}
		]
	});
});