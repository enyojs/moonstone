enyo.kind({
    name: "moon.sample.music.TrackTwoColumnsWideSample",
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
            name: "trackList",
            /** Todo: Change enyo.DataGridList to moon.DataGridList */
            kind: "enyo.DataGridList",
            flex: true,
            components: [
                {
                    kind: "moon.Item",
                    spotlight: true,
                    ontap: "changeName",
                    style: "width: 670px",
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
                                                    classes: "moon-music-small-image",
                                                    bindFrom: "coverUrl", 
                                                    bindTo: "src"
                                                }
                                            ],
                                            attributes: {rowspan: "3"}
                                        },
                                        {
                                            style: "height: 35px; width: 300px;"
                                        },
                                        {
                                            bindFrom: "time", 
                                            attributes: {rowspan: "3"},
                                            style: "width: 200px"
                                        }
                                    ]
                                },
                                {
                                    components: [
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
                    kind: "moon.sample.music.TrackTwoColumnsWideSample",
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
                    /** Todo: find the way how to access active datalist row */
                    inSender.parent.parent.parent.parent.parent.parent.parent.parent.parent.parent.controller.set("track", "Good track");
                }
            }
        ]
    });
});
