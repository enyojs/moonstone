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
								{kind: "moon.Item", ontap: "changeName", layoutKind: "FittableColumnsLayout", components: [
									{name: "enyoImage", kind: "enyo.Image", style: "width: 170px; height: 126px; padding-right: 30px;"},
									{components: [
										{name: "imageTrack"},
										{name: "imageArtist", classes: "moon-superscript"},
										{name: "imageTime", classes: "moon-superscript"}
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
                model: sampleModel,
                changeName: function(inSender, inEvent) {
                    inSender.parent.controller.set("track", "Good track");
                }
            }
        ]
    });
});