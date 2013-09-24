// Sample view

enyo.kind({
	name: "moon.sample.music.TrackDetailNarrowSample2",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	useHandle: false,
	components: [
		{
			title: "Track Name",
			titleAbove: "03",
			titleBelow: "",
			headerComponents: [
				{components: [
					{kind: "moon.IconButton", src: "../assets/icon-album.png"},
					{kind: "moon.IconButton", src: "../assets/icon-download.png"},
					{kind: "moon.IconButton", src: "../assets/icon-like.png"},
					{kind: "moon.IconButton", src: "../assets/icon-next.png"}
				]}
			],
			components: [
				{fit: true, kind: "moon.Scroller", components: [
					{kind: "FittableColumns", components: [
						{kind: "enyo.Table", classes: "moon-5h", components: [
							{components: [
								{attributes: {colspan: "2"}, components: [
									{name: "image", kind: "enyo.Image", style: "width: 350px; height: 350px;"}
								]}
							]},
							{components: [
								{attributes: {colspan: "2"}, components: [
									{kind: "moon.Divider", content: "Track Info"}
								]}
							]},
							{components: [
								{content: "Released"},
								{name: "released"}
							]},
							{components: [
								{content: "Artist"},
								{name: "artist"}
							]},
							{components: [
								{content: "Album"},
								{name: "album"}
							]},
							{components: [
								{content: "Genre"},
								{name: "genre"}
							]}
						]},
						{fit: true, components: [
							{kind: "moon.Divider", content: "More"},
							{kind: "Group", components: [
								{kind: "moon.SelectableItem", content: "Lyrics"},
								{kind: "moon.SelectableItem", content: "Artist"},
								{kind: "moon.SelectableItem", content: "Album"},
								{kind: "moon.SelectableItem", content: "Similar Track"},
								{kind: "moon.SelectableItem", content: "Related Videos"}
							]}
						]}
					]}
				]}
			]
		}
	],
	bindings: [
		{from: ".controller.coverUrl", to: ".$.image.src"},
		{from: ".controller.released", to: ".$.released.content"},
		{from: ".controller.artist", to: ".$.artist.content"},
		{from: ".controller.album", to: ".$.album.content"},
		{from: ".controller.genre", to: ".$.genre.content"}
	]
});

// Sample Model

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        coverUrl: "../assets/default-music-big.png",
        released: "5 April 2013",
        artist: "Name",
        album: "New",
        genre: "Ballad"
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.TrackDetailNarrowSample2",
                    controller: ".app.controllers.trackController",
                    classes: "enyo-fit"
                },
                {kind: "enyo.Image", style: "height:100%; width:100%; z-index: -1", src: enyo.Image.placeholder}
            ]
        },
        controllers: [
            {
                name: "trackController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});