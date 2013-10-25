// Sample view

enyo.kind({
    name: "moon.sample.music.TrackDetailWideSample2",
    components: [{
        kind: "moon.Panels",
        pattern: "activity",
        useHandle: false,
        components: [
            {
                kind: "moon.Panel",
                title: "Track Name",
                titleAbove: "03",
                titleBelow: "",
                layoutKind: "FittableColumnsLayout",
                headerComponents: [
                    {kind: "moon.IconButton", src: "../assets/icon-album.png"},
                    {kind: "moon.IconButton", src: "../assets/icon-download.png"},
                    {kind: "moon.IconButton", src: "../assets/icon-like.png"},
                    {kind: "moon.IconButton", src: "../assets/icon-next.png"}
                ],
                components: [
                    {classes: "moon-5h", components: [
                        {name: "image", kind: "enyo.Image", style: "width: 350px; height: 350px;"}
                    ]},
                    {kind: "FittableRows", fit: true, components: [
                        {kind: "moon.Divider", content: "Track Info"},
                        {kind: "FittableColumns", fit: true, components: [
                            {kind: "enyo.Table", fit: true, components: [
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
                            ]}
                        ]}
                    ]},
                    {classes: "moon-5h", kind: "FittableRows", components: [
                        {kind: "moon.Divider", content: "More"},
                        {kind: "moon.Scroller", fit: true, components: [
                            {kind: "Group", components: [
                                {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Lyrics"},
                                {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Artist"},
                                {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Album"},
                                {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Similar Track"},
                                {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Related Videos"}
                            ]}
                        ]}
                    ]}
                ]
            }
        ]
    }],
    bindings: [
        {from: ".controller.coverUrl", to: ".$.image.src"},
        {from: ".controller.released", to: ".$.released.content"},
        {from: ".controller.artist", to: ".$.artist.content"},
        {from: ".controller.album", to: ".$.album.content"},
        {from: ".controller.genre", to: ".$.genre.content"}
    ]
});

enyo.ready(function() {
    // Sample Model
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
            classes: "enyo-undelectable moon",
            components: [
                {
                    kind: "moon.sample.music.TrackDetailWideSample2",
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
