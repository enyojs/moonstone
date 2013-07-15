// Sample view

enyo.kind({
    name: "moon.sample.music.TrackOneColumnWideSample2",
    kind: "moon.Panel",
    titleAbove: "02",
    title: "Browser Tracks",
    titleBelow: "15 Tracks",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-album.png"},
        {kind: "moon.IconButton", src: "../assets/icon-list.png"}
    ],
    components: [
        {
            kind:"moon.Scroller",
            horizontal: "hidden",
            fit: true,
            components: [
                {
                    name: "trackList",
                    kind: "moon.DataTable",
                    components: [
                        {
                            components: [
                                {
                                    components: [
                                        {
                                            kind: "moon.Item",
                                            components: [
                                                {
                                                    kind: "enyo.Image",
                                                    classes: "moon-music-small-image",
                                                    bindFrom: "coverUrl",
                                                    bindTo: "src"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            kind: "moon.Item",
                                            ontap: "changeName",
                                            bindFrom: "track"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            kind: "moon.Item",
                                            ontap: "changeName",
                                            bindFrom: "artist"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            kind: "moon.Item",
                                            ontap: "changeName",
                                            bindFrom: "album"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            kind: "moon.Item",
                                            ontap: "changeName",
                                            bindFrom: "time"
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
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name", artist: "Artist name", album: "Album name", time: "3:40"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.TrackOneColumnWideSample2",
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
                    /** Todo: find the way how to access active datalist row */
                    inSender.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.controller.set("track", "Good track");
                }
            }
        ]
    });
});