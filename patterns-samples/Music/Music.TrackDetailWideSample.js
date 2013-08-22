// Sample view

enyo.kind({
    name: "moon.sample.music.TrackDetailWideSample",
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
            kind: "FittableRows",
            fit: true,
            components: [
                {kind: "moon.Divider", content: "Lyrics"},
                {
                    kind: "moon.Scroller",
                    fit: true,
                    components: [
                        {
                            allowHtml: true,
                            name: "lyrics"
                        }
                    ]
                }
            ]
        },
        {
            kind: "FittableRows",
            classes: "moon-5h",
            components: [
                {kind: "moon.Divider", content: "More"},
                {
                    kind: "Group", 
                    fit: true,
                    components: [
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
        {from: ".controller.lyrics", to: ".$.lyrics.content"},
        {from: ".controller.released", to: ".$.released.content"},
        {from: ".controller.genre", to: ".$.genre.content"}
    ]
});

// Sample Model

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        coverUrl: "../assets/default-music-big.png",
        released: "5 April 2013",
        genre: "Ballad",
        lyrics: "Can't see the lights or the blue orange signs<br />"
            + "Can't see the road or the long white lines<br />"
            + "Feeling the ground through the pedals on the floor<br />"
            + "Felling death pounding at the door<br /><br />"
            + "Windows all open, chaos in my hair<br />"
            + "Driving me round and leaving me there<br />"
            + "Cover my eyes and we'll die driving blind<br />"
            + "Cover my trail and we'll leave this life behind<br /><br />"
            + "Drive blind<br /><br />All at onec, too mush light<br />"
            + "Captured and frozen, hear no sound<br />Bright flashes penetrate<br />"
            + "Glowing, flowing, lifting off the ground"
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.TrackDetailWideSample",
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