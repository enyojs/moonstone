// Sample view

enyo.kind({
    name: "moon.sample.music.TrackDetailWideSample2",
    kind: "moon.Panel",
    title: "Track Name",
    titleAbove: "03",
    titleBelow: "",
    layoutKind: "FittableColumnsLayout",
    headerComponents: [
        {kind: "moon.IconButton", src: "assets/icon-album.png"},
        {kind: "moon.IconButton", src: "assets/icon-download.png"},
        {kind: "moon.IconButton", src: "assets/icon-like.png"},
        {kind: "moon.IconButton", src: "assets/icon-next.png"}
    ],
    components: [
        {
            classes: "moon-5h",
            components: [
                {            
                    name: "image",
                    kind: "enyo.Image",
                    style: "width: 350px; height: 350px;",
                }
            ]
        },
        {
            kind: "enyo.Table",
            fit: true,
            components: [
                {
                    components: [
                        {
                            components: [
                                {
                                    kind: "moon.Divider",
                                    content: "Track Info"
                                }
                            ],
                            attributes: {colspan: 2}
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
                        {content: "Artist"},
                        {name: "artist"}
                    ]
                },
                {
                    components: [
                        {content: "Album"},
                        {name: "album"}
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
            classes: "moon-5h",
            components: [
                {kind: "moon.Divider", classes: "moon-music-detail-more", content: "More"},
                {kind: "Group", components: [
                    {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Lyrics", spotlight: true},
                    {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Artist", spotlight: true},
                    {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Album", spotlight: true},
                    {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Similar Track", spotlight: true},
                    {kind: "moon.SelectableItem", classes: "moon-music-item", content: "Related Videos", spotlight: true}
                ]}
            ]
        }
    ],
    bindings: [
        {from: ".controller.coverUrl", to: "$.image.src"},
        {from: ".controller.released", to: "$.released.content"},
        {from: ".controller.artist", to: "$.artist.content"},
        {from: ".controller.album", to: "$.album.content"},
        {from: ".controller.genre", to: "$.genre.content"}
    ]
});

// Sample Model

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        coverUrl: "assets/default-music-big.png",
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
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.TrackDetailWideSample2",
                    controller: ".app.controllers.trackController",
                    classes: "enyo-fit",
                    style: "background-image: url(assets/livetv-background.png); background-size: 100% 100%;"
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
