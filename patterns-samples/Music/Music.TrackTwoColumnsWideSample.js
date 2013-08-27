enyo.kind({
    name: "moon.sample.music.TrackTwoColumnsWideSample",
    kind: "moon.Panel",
    titleAbove: "02",
    title: "Browse Tracks",
    titleBelow: "15 Tracks",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-album.png"},
        {kind: "moon.IconButton", src: "../assets/icon-list.png"}
    ],
    components: [
        {
            name: "trackList",
            kind: "moon.DataGridList",
            fit: true,
            minWidth: 180, 
            minHeight: 240,
            components: [
                {
                    kind: "moon.GridListImageItem",
                    ontap: "changeName",
                    bindings: [
                        {from: ".model.coverUrl", to: ".source"},
						{from: ".model.track", to: ".caption"},
                        {from: ".model.artist", to: ".subCaption"}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.track", to: ".$.trackList.controller"}
    ]
});


// Sample Model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        track: new enyo.Collection([
            {coverUrl: "../assets/default-music.png", track: "Track name 1",  artist: "Artist name 1",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 2",  artist: "Artist name 2",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 3",  artist: "Artist name 3",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 4",  artist: "Artist name 4",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 5",  artist: "Artist name 5",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 6",  artist: "Artist name 6",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 7",  artist: "Artist name 7",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 8",  artist: "Artist name 8",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 9",  artist: "Artist name 9",  album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 10", artist: "Artist name 10", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 11", artist: "Artist name 11", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 12", artist: "Artist name 12", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 13", artist: "Artist name 13", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 14", artist: "Artist name 14", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 15", artist: "Artist name 15", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 16", artist: "Artist name 16", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 17", artist: "Artist name 17", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 18", artist: "Artist name 18", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 19", artist: "Artist name 19", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 20", artist: "Artist name 20", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 21", artist: "Artist name 21", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 22", artist: "Artist name 22", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 23", artist: "Artist name 23", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 24", artist: "Artist name 24", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 25", artist: "Artist name 25", album: "Album name", time: "3:40"},
            {coverUrl: "../assets/default-music.png", track: "Track name 26", artist: "Artist name 26", album: "Album name", time: "3:40"}
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
