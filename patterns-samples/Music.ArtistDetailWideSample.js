// Sample view

enyo.kind({
    name: "moon.sample.music.ArtistDetailWideSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Artist",
    titleBelow: "Artist Name",
    layoutKind: "FittableColumnsLayout",
    headerComponents: [
        {
            classes: "moon-music-detail-header-button",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-like.png"},
                {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
            ]
        }
    ],
    components: [
        {
            classes: "moon-5h",
            components: [
                {
                    name: "artistImage",
                    kind: "enyo.Image",
                    classes: "moon-music-big-image"
                },
                {
                    classes: "enyo-table",
                    style: "width: 100%",
                    components: [
                        {
                            classes: "enyo-table-row",
                            components: [
                                {content: "Organized", classes: "enyo-table-cell"},
                                {name: "organized", classes: "enyo-table-cell"}
                            ]
                        },
                        {
                            xstyle: "display: table-row;",
                            classes: "enyo-table-row",
                            components: [
                                {content: "Debut", classes: "enyo-table-cell"},
                                {name: "debut", classes: "enyo-table-cell"}
                            ]
                        },
                        {
                            xstyle: "display: table-row;",
                            classes: "enyo-table-row",
                            components: [
                                {content: "Type", classes: "enyo-table-cell"},
                                {name: "type", classes: "enyo-table-cell"}
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
                    kind: "enyo.DataTable",
                    components: [{
                        kind: "enyo.Image",
                        classes: "moon-music-small-image",
                        bindFrom: "relatedUrl",
                        bindTo: "src"
                    }]
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
                            classes: "moon-music-item",
                            components: [
                                {
                                    kind: "enyo.Image",
                                    classes: "moon-music-small-image",
                                    bindFrom: "coverUrl",
                                    bindTo: "src"
                                },
                                {
                                    kind: "enyo.FittableRows",
                                    classes: "moon-music-item-label",
                                    components: [
                                        {bindFrom: "track", },
                                        {bindFrom: "artist", classes: "moon-music-item-label-small"},
                                        {bindFrom: "duration", classes: "moon-music-item-label-small"}
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
        artistImageUrl: "http://www.biography.com/imported/images/Biography/Images/Profiles/M/Paul-Mccartney-9390850-1-402.jpg",
        organized: "5 April 2013",
        debut: "5 April 1973",
        type: "Solo",
        bio: "Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of",
        related: new enyo.Collection([
            {relatedUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-"},
            {relatedUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8QwvaGvOfOFEM86P5tfDvT-HwCYJMdNkzX9QWlVBw3JdFq5bI"},
            {relatedUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRZloZ98xtYFPjkhKdwbmKYElRXdr4ehWf41-oBcS7WLXhBJHvX"}
        ]),
        tracks: new enyo.Collection([
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", track: "A Day In The Life / Give Peace A Chance", artist: "Paul Mccartney", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", track: "A Lovely Way To Spend An Evening", artist: "Paul Mccartney", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", track: "Ain't That A Shame", artist: "Paul Mccartney", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", track: "All Shook Up", artist: "Paul Mccartney", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", track: "A Day In The Life / Give Peace A Chance", artist: "Paul Mccartney", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", track: "A Lovely Way To Spend An Evening", artist: "Paul Mccartney", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", track: "Ain't That A Shame", artist: "Paul Mccartney", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", track: "All Shook Up", artist: "Paul Mccartney", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", track: "A Day In The Life / Give Peace A Chance", artist: "Paul Mccartney", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", track: "A Lovely Way To Spend An Evening", artist: "Paul Mccartney", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", track: "Ain't That A Shame", artist: "Paul Mccartney", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", track: "All Shook Up", artist: "Paul Mccartney", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", track: "A Day In The Life / Give Peace A Chance", artist: "Paul Mccartney", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", track: "A Lovely Way To Spend An Evening", artist: "Paul Mccartney", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", track: "Ain't That A Shame", artist: "Paul Mccartney", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", track: "All Shook Up", artist: "Paul Mccartney", duration: "2:04"}
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
