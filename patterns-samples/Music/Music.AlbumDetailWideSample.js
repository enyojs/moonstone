// Sample view

enyo.kind({
    name: "moon.sample.music.AlbumDetailWideSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Album",    
    titleBelow: "ALBUM TITLE(ARTISTS)",
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
                    name: "cover",
                    kind: "enyo.Image",
                    style: "width: 350px; height: 350px;",
                },
                {
                    kind: "moon.Table",
                    classes: "enyo-table-fit",
                    components: [
                        {components: [
                            {content: "Released"},
                            {name: "releaseDate"}
                        ]},
                        {components: [
                            {content: "Genre"},
                            {name: "genre"}
                        ]}
                    ]
                }
            ]
        },
        {
            kind: "FittableRows",
            fit:true, 
            components: [
                {kind: "moon.Divider", content: "Top 11 Tracks"},
                {
                    kind: "moon.Scroller",
                    fit: true,
                    horizontal: "hidden",
                    components: [
                        {
                            name: "trackInfo",
                            kind: "moon.DataTable",
                            style: "width: 100%",
                            components: [
                                {
                                    spotlight: true,
                                    ontap: "changeTrackName",
                                    components: [
                                        {bindFrom: "number"},
                                        {bindFrom: "name"},
                                        {bindFrom: "duration"}
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
        {from: ".controller.releaseDate", to: "$.releaseDate.content"},
        {from: ".controller.genre", to: "$.genre.content"},
        {from: ".controller.coverUrl", to: "$.cover.src"},
        {from: ".controller.tracks", to: "$.trackInfo.controller"}
    ]
});

// Sample model

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        releaseDate: "1981",
        genre: "Rock",
        tracks: new enyo.Collection([
            {number: "1", name: "Bohemian Rhapsody", duration: "5:56"},
            {number: "2", name: "Another One Bites the Dust", duration: "3:36"},
            {number: "3", name: "Killer Queen", duration: "2:57"},
            {number: "4", name: "Fat Bottomed Girls", duration: "3:16"},
            {number: "5", name: "Bicycle Race", duration: "3:01"},
            {number: "6", name: "You're My Best Friend", duration: "2:52"},
            {number: "7", name: "Don't Stop Me Now", duration: "3:29"},
            {number: "8", name: "Save Me", duration: "3:52"},
            {number: "9", name: "Crazy Little Thing Called Love", duration: "2:42"},
            {number: "10", name: "Somebody to Love", duration: "4:56"},
            {number: "11", name: "Now I'm Here", duration: "4:10"},
            {number: "12", name: "Good Old-Fashioned Lover Boy", duration: "2:54"},
            {number: "13", name: "Play the Game", duration: "3:33"},
            {number: "14", name: "Flash", duration: "2:48"},
            {number: "15", name: "Seven Seas of Rhye", duration: "2:47"},
            {number: "16", name: "We Will Rock You", duration: "2:01"},
            {number: "17", name: "We Are the Champions", duration: "2:59"}
        ]),
        coverUrl: "assets/default-music-big.png"
    });
    
//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.AlbumDetailWideSample",
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