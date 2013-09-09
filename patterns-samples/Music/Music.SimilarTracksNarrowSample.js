// Sample View

enyo.kind({
	name: "moon.sample.music.SimilarTracksNarrowSample",
	kind: "moon.Panels",
	pattern: "alwaysviewing",
	useHandle: false,
	components: [
		{
			title: "Similar Tracks", 
			titleAbove: "04", 
			titleBelow: "10 Tracks",
			headerComponents: [
				{kind: "moon.IconButton", src: "../assets/icon-like.png"},
				{kind: "moon.IconButton", src: "../assets/icon-next.png"}
			],
			components: [
				{
					name: "trackList",
					kind: "moon.DataList",
					scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
					fit: true,
					components: [
						{
							bindings: [
								{from: ".model.coverUrl", to: ".$.enyoImage.src"},
								{from: ".model.track", to: ".$.imageTrack.content"},
								{from: ".model.artist", to: ".$.imageArtist.content"},
								{from: ".model.time", to: ".$.imageTime.content"}
							],
							components: [                    
								{kind: "moon.Item", ontap: "changeName", layoutKind: "FittableColumnsLayout", classes: "moon-hspacing", components: [
									{name: "enyoImage", kind: "enyo.Image", style: "width: 126px; height: 126px;"},
									{classes: "moon-header-font", components: [
										{name: "imageTrack", classes: "moon-super-header-bold-text"},
										{name: "imageArtist", classes: "moon-superscript"},
										{name: "imageTime", classes: "moon-superscript"}
									]}                            
								]}
							],
							changeName: function(inSender, inEvent) {
								inSender.parent.model.set("track", "Good track");
							}
						}
					]
				}
			]
		}
	],
	bindings: [
		{from: ".controller.track", to: ".$.trackList.controller"}
	]
});

// Sample model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        track: new enyo.Collection([
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.SimilarTracksNarrowSample",
                    controller: ".app.controllers.trackController",
                    classes: "enyo-fit"
                }
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