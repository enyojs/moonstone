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
                                ]},
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
                                            bindFrom: "number",
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
        {classes: "moon-music-detail-header-button", components: [
            {kind: "moon.IconButton", src: "assets/icon-like.png"},
            {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
        ]}
    ],
    bindings: [
        {from: ".controller.artist", to: "$.artist.content"},
        {from: ".controller.releaseDate", to: "$.releaseDate.content"},
        {from: ".controller.genre", to: "$.genre.content"},
        {from: ".controller.album", to: "$.album.content"},
        {from: ".controller.coverUrl", to: "$.cover.src"}
    ],
    controllerChanged: function(inProp, inPrev, inVal) {
        if (this.controller && this.controller.get) {
            this.$.trackInfo.controller.add(this.controller.get("tracks")); 
        }
    }
});

enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSampleController",
    kind: "enyo.ObjectController",
    data: {
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
    },
    changeTrackName: function(inSender, inEvent) {
        inSender.parent.controller.set("name", "We are the Champions");
    }
});

enyo.ready(function(){
    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.AlbumDetailNarrowSample",
                    controller: "moon.sample.music.AlbumDetailNarrowSampleController",
                    classes: "enyo-fit"
                }
            ]
        }
    });
});


/*enyo.kind({
    name: "enyo.sample.FlexLayoutScrollerIssue",
    classes: "enyo-fit",
    components: [
        {
            kind: "VFlexBox",
            style: "width: 100px; height: 100%;",
            components: [
                {style: "background: red; height: 75%;"},
                {
                    kind: "Scroller",
                    strategyKind: "TouchScrollStrategy",
                    flex: true,
                    components: [
                        {
                            style: "background: white",
                            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ' +
                            'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
                            'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in ' +
                            'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint ' +
                            'occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit ' +
                            'anim id est laborum.'
                        }
                    ]
                }
            ]
        }
    ]
});*/

/*enyo.ready(function() {
    enyo.kind({
        name: "TestApp",
        kind: "enyo.Application",
        view: "TestView"
    });

    enyo.kind({
        name: "TestView",
        controller: "enyo.ObjectController",
        components: [
            //{content: "Foo"}
            {kind: "moon.Scroller"}
        ]
    });

    app = new TestApp();
});*/

