// Sample view

enyo.kind({
    name: "moon.sample.music.TrackDetailNarrowSample",
    kind: "moon.Panel",
    title: "Track Name",
    titleAbove: "03",
    titleBelow: "Artist Name",
    layoutKind: "FittableColumnsLayout",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-album.png"},
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-like.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    components: [
        {
            kind: "enyo.Table",
            classes: "moon-5h",
            components: [
                {
                    components: [
                        {
                            components: [
                                {
                                    name: "image",
                                    kind: "enyo.Image",
                                    style: "width: 350px; height: 350px;"
                                }
                            ],
                            attributes: {colspan: "2"}
                        }
                    ]
                },
                {
                    components: [
                        {content: "Released"},
                        {name: "released"}
                    ]
                },
                {
                    components: [
                        {content: "Genre"},
                        {name: "genre"}
                    ]
                }
            ]
        },
        {
            fit: true,
            components: [
                {
                    kind: "moon.Divider",
                    content: "More"
                },
                {
                    kind: "Group",
                    components: [
                        {kind: "moon.SelectableItem", content: "Lyrics"},
                        {kind: "moon.SelectableItem", content: "Artist"},
                        {kind: "moon.SelectableItem", content: "Album"},
                        {kind: "moon.SelectableItem", content: "Similar Track"},
                        {kind: "moon.SelectableItem", content: "Related Videos"}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.coverUrl", to: ".$.image.src"},
        {from: ".controller.released", to: ".$.released.content"},
        {from: ".controller.genre", to: ".$.genre.content"}
    ]
});

// Sample Model

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        coverUrl: "../assets/default-music-big.png",
        released: "5 April 2013",
        genre: "Ballad"
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.TrackDetailNarrowSample",
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