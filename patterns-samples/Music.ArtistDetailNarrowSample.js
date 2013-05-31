// Sample view

enyo.kind({
    name: "moon.sample.music.ArtistDetailNarrowSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Artist",
    titleBelow: "",
    layoutKind: "FittableRowsLayout",
    headerComponents: [
        {
            components: [
                {kind: "moon.IconButton", src: "assets/icon-like.png"},
                {kind: "moon.IconButton", src: "assets/icon-next.png"}
            ]
        }
    ],
    components: [
        {
            kind: "enyo.FittableColumns",
            noStretch: true,
            components: [
                {
                    name: "artistImage",
                    kind: "enyo.Image",
                    style: "width: 200px; height: 200px;"
                },
                {
                    kind: "enyo.Table",
                    name: "artistInfo",
                    fit: true,
                    components: [
                        {components: [{name: "artist", attributes: {colspan: "2"}, style: "font-weight: bold;"}]},
                        {components: [
                            {content: "Organized"},
                            {name: "organizedDate"}
                        ]},
                        {components: [
                            {content: "Debut"},
                            {name: "debutDate"}
                        ]},
                        {components: [
                            {content: "Type"},
                            {name: "type"}
                        ]}
                    ]
                }
            ]
        },
        {kind: "moon.Divider", content: "Top 10 Tracks"},
        {
            name: "trackInfo",
            kind: "enyo.DataList",
            scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
            fit: true,
            components: [
                {
                    kind: "moon.Item",
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
                                            attributes: {rowspan: "3"}
                                        },
                                        {
                                            bindFrom: "name"
                                        }
                                    ]
                                },
                                {
                                    components: [
                                        {
                                            bindFrom: "duration", 
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
        {from: ".controller.artist", to: "$.artist.content"},
        {from: ".controller.organizedDate", to: "$.organizedDate.content"},
        {from: ".controller.debutDate", to: "$.debutDate.content"},
        {from: ".controller.type", to: "$.type.content"},
        {from: ".controller.artistImageUrl", to: "$.artistImage.src"},
        {from: ".controller.tracks", to: "$.trackInfo.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        artist: "Paul McCartney",
        organizedDate: "5 April 2013",
        debutDate: "5 April 1973",
        type: "Solo",
        tracks: new enyo.Collection([
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", name: "Track Name", duration: "3:40"}
        ]),
        artistImageUrl: "assets/default-music-big.png"
    });
 
//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.ArtistDetailNarrowSample",
                    controller: ".app.controllers.albumController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "albumController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeTrackName: function(inSender, inEvent) {
                    inSender.parent.controller.set("name", "We are the Champions");
                }
            }
        ]
    });
});