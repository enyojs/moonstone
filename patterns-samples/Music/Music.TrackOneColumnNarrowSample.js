// Sample view

enyo.kind({
    name: "moon.sample.music.TrackOneColumnNarrowSample",
    kind: "moon.Panel",
    title: "Browser Tracks",
    titleAbove: "02",
    titleBelow: "",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-album.png"},
        {kind: "moon.IconButton", src: "../assets/icon-list.png"}
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
                                                    bindFrom: "coverUrl", 
                                                    bindTo: "src"
                                                }
                                            ],
                                            attributes: {rowspan: "2"}
                                        },
                                        {
                                            bindFrom: "track"
                                        },
                                        {
                                            bindFrom: "time", 
                                            attributes: {rowspan: "2"}
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
                                }
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

// Sample Model

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
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
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
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.TrackOneColumnNarrowSample",
                    controller: ".app.controllers.trackController",
                    classes: "enyo-fit",
                    style: "background-image: url(../assets/livetv-background.png); background-size: 100% 100%;"
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