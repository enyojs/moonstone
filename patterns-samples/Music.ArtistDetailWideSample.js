// Sample view

enyo.kind({
    name: "moon.sample.music.ArtistDetailWideSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Artist",
    titleBelow: "Artist Name",
    layoutKind: "FittableColumnsLayout",
    headerComponents: [
        {kind: "moon.IconButton", src: "assets/icon-like.png"},
        {kind: "moon.IconButton", src: "assets/icon-next.png"}
    ],
    components: [
        {
            classes: "moon-5h",
            components: [
                {
                    name: "artistImage",
                    kind: "enyo.Image",
                    style: "width: 350px; height: 350px;",
                },
                {
                    kind: "moon.Table",
                    classes: "enyo-table-fit",
                    components: [
                        {
                            components: [
                                {content: "Organized"},
                                {name: "organized"}
                            ]
                        },
                        {
                            components: [
                                {content: "Debut"},
                                {name: "debut"}
                            ]
                        },
                        {
                            components: [
                                {content: "Type"},
                                {name: "type"}
                            ]
                        }
                    ]
                }
            ]
        },
        {
            kind: "FittableRows",
            fit: true,
            components: [
                {kind: "moon.Divider", content: "Bio"},
                {
                    kind: "moon.Scroller", 
                    horizontal: "hidden",
                    fit: true,
                    components: [
                        {name: "bio", allowHtml: true}
                    ]
                }
            ]
        },
        {
            kind: "FittableRows",
            classes: "moon-6h",
            components: [
                {kind: "moon.Divider", content: "Related Artists"},
                {
                    name: "relatedArtists",
                    kind: "moon.DataGridList",
                    classes: "moon-1v",
                    components: [
                        {
                            kind: "enyo.Image",
                            style: "width: 130px; height: 130px;",
                            bindFrom: "relatedUrl",
                            bindTo: "src"
                        }
                    ]
                },
                {kind: "moon.Divider", content: "Top 10 Tracks"},
                {
                    name: "trackInfo",
                    kind: "moon.DataList",
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
                                                    attributes: {rowspan: "4"}
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
            ]
        }
    ],
    bindings: [
        {from: ".controller.artist", to: "$.artist.content"},
        {from: ".controller.artistImageUrl", to: "$.artistImage.src"},
        {from: ".controller.organized", to: "$.organized.content"},
        {from: ".controller.debut", to: "$.debut.content"},
        {from: ".controller.type", to: "$.type.content"},
        {from: ".controller.bio", to: "$.bio.content"},
        {from: ".controller.related", to: "$.relatedArtists.controller"},
        {from: ".controller.tracks", to: "$.trackInfo.controller"}
    ]
});


// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        artist: "Paul McCartney",
        artistImageUrl: "assets/default-music-big.png",
        organized: "5 April 2013",
        debut: "5 April 1973",
        type: "Solo",
        bio: "Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of",
        related: new enyo.Collection([
            {relatedUrl: "assets/default-music.png"},
            {relatedUrl: "assets/default-music.png"},
            {relatedUrl: "assets/default-music.png"}
        ]),
        tracks: new enyo.Collection([
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"},
            {coverUrl: "assets/default-music.png", track: "track name", artist: "artist name", duration: "3:40"}
        ])
        
    });
 
//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.ArtistDetailWideSample",
                    controller: ".app.controllers.artistController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "artistController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeTrackName: function(inSender, inEvent) {
                    inSender.parent.controller.set("name", "We are the Champions");
                }
            }
        ]
    });
});
