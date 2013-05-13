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
            classes: "moon-music-detail-header-button",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-like.png"},
                {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
            ]
        }
    ],
    components: [
        {
            kind: "FittableColumns",
            components: [
                {
                    name: "artistImage",
                    kind: "enyo.Image",
                    style: "height: 200px; width: 200px;"
                },
                {
                    kind: "moon.Table",
                    name: "artistInfo",
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
            kind: "moon.Scroller",
            fit: true,
            horizontal: "hidden",
            components: [
               {
                    name: "trackInfo",
                    kind: "enyo.DataList",
                    components: [
                        {
                            /* Todo: Needs to make a component for this */
                            name: "item",
                            kind: "enyo.FittableColumns",
                            classes: "moon-music-item",
                            fit: true,
                            components: [
                                {
                                    name: "cover",
                                    kind: "enyo.Image",
                                    style: "height: 126px; width: 126px;",
                                    classes: "moon-music-item-image",
                                    bindFrom: "coverUrl", 
                                    bindTo: "src"
                                },
                                {
                                    classes: "moon-music-item-label",
                                    fit: true,
                                    components: [
                                        {bindFrom: "name"},
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
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", name: "A Day In The Life / Give Peace A Chance", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", name: "A Lovely Way To Spend An Evening", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", name: "Ain't That A Shame", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", name: "All Shook Up", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", name: "A Day In The Life / Give Peace A Chance", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", name: "A Lovely Way To Spend An Evening", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", name: "Ain't That A Shame", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", name: "All Shook Up", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", name: "A Day In The Life / Give Peace A Chance", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", name: "A Lovely Way To Spend An Evening", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", name: "Ain't That A Shame", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", name: "All Shook Up", duration: "2:04"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-Vd9y-xwlX8kVxfGhWuDY-LeynvSM8dlUPL3qtsYhVEfb6X4", name: "A Day In The Life / Give Peace A Chance", duration: "5:44"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRQDnsmdRkuX8viSpmoE6YwgR_JvgM9ikv68ORR7HCtfP6LLuLnRQ", name: "A Lovely Way To Spend An Evening", duration: "3:06"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLf3VBLXboAa55J9GkAVwoozAtQTfeUPsQc5P33MzTga-YVsxzQ", name: "Ain't That A Shame", duration: "3:40"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR0fTM65PSpV99dQ0oRYhA1hi76oPxGznpdOGQL6M0X2lryckJ-", name: "All Shook Up", duration: "2:04"}
        ]),
        artistImageUrl: "http://www.biography.com/imported/images/Biography/Images/Profiles/M/Paul-Mccartney-9390850-1-402.jpg"
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