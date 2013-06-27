// Sample view

enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Album",    
    titleBelow: "",
    components: [
        {
            name: "detail",
            fit: true,
            kind: "FittableRows",
            components: [
                {
                    kind: "FittableColumns",
                    noStretch: true,
                    components: [
                        {
                            name: "cover",
                            kind: "enyo.Image",
                            style: "height: 200px; width: 200px;"
                        },
                        {
                            kind: "moon.Table",
                            name: "albumInfo",
                            fit: true,
                            components: [
                                {components: [
                                    {name: "album", attributes: {colspan: "2"}, style: "font-weight: bold;"}
                                ]},
                                {components: [
                                    {content: "Artist"},
                                    {name: "artist"}
                                ]},
                                {components: [
                                    {content: "Released"},
                                    {name: "releaseDate"}
                                ]},
                                {name: "genreRow", components: [
                                    {content: "Genre"},
                                    {name: "genre"}
                                ]}
                            ]
                        }
                    ]
                },
                {kind: "moon.Divider", content: "SONGS"},
                {
                    kind: "moon.Scroller",
                    fit: true,
                    components: [
                        {
                            name: "trackInfo",
                            kind: "moon.DataTable",
                            style: "width: 100%;",
                            components: [
                                {
                                    spotlight: true,
                                    ontap: "changeTrackName",
                                    components: [
                                        {
                                            bindFrom: "number"
                                        },
                                        {
                                            bindFrom: "name"
                                        },
                                        {
                                            bindFrom: "duration"
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
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-like.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    bindings: [
        {from: ".controller.artist", to: "$.artist.content"},
        {from: ".controller.releaseDate", to: "$.releaseDate.content"},
        {from: ".controller.genre", to: "$.genre.content"},
        {from: ".controller.album", to: "$.album.content"},
        {from: ".controller.coverUrl", to: "$.cover.src"},
        {from: ".controller.tracks", to: "$.trackInfo.controller.data"}
    ]
});

// Sample controller

enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSampleController",
    kind: "enyo.ModelController",
    changeTrackName: function(inSender, inEvent) {
        inSender.parent.controller.set("name", "We are the Champions");
    }
});

// Mock data and application to render sample

enyo.ready(function(){
    var mockData = {
        artist: "Queen",
        album: "Greatest Hits",
        releaseDate: "5 April 2013",
        genre: "Rock",
        tracks: [
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "2", name: "Killer Queen", duration: "3:30", price: "$1.99"}
        ],
        coverUrl: "http://placehold.it/200x200"
    };
    
    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    name: "albumDetail",
                    kind: "moon.sample.music.AlbumDetailNarrowSample",
                    controller: "moon.sample.music.AlbumDetailNarrowSampleController",
                    classes: "enyo-fit"
                }
            ],
            model: new enyo.Model(mockData),
            bindings: [
                {from: ".model", to: ".$.albumDetail.controller.model"}
            ]
        }
    });
});