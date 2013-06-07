// Sample View

enyo.kind({
    name: "moon.sample.music.SimilarTracksNarrowSample",
    kind: "moon.Panel",
    title: "Similar Tracks",
    titleAbove: "04",
    titleBelow: "10 Tracks",
    headerComponents: [
        {kind: "moon.IconButton", src: "assets/icon-like.png"},
        {kind: "moon.IconButton", src: "assets/icon-next.png"}
    ],
    components: [
        {
            name: "trackList",
            kind: "moon.DataList",
            scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
            fit: true,
            components: [
                {
                    kind: "moon.Item",
                    spotlight: true,
                    ontap: "changeName",
                    components: [
                        {
                            kind: "enyo.Table",
                            components: [
                                {
                                    components: [
                                        {
                                            components: [
                                                {
                                                    kind: "enyo.Image", 
                                                    style: "width: 126px; height: 126px;",
                                                    bindFrom: "coverUrl", 
                                                    bindTo: "src"
                                                }
                                            ],
                                            attributes: {rowspan: "3"}
                                        },
                                        {
                                            bindFrom: "track"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            bindFrom: "artist", 
                                            classes: "moon-superscript"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            bindFrom: "time", 
                                            classes: "moon-superscript"
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
    		]
        }
    ],
    bindings: [
        {from: ".controller.track", to: "$.trackList.controller"}
    ]
});

// Sample model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        track: new enyo.Collection([
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
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