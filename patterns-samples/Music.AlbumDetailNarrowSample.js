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
        {from: ".controller.coverUrl", to: "$.cover.src"}/*,
        {from: ".controller.tracks", to: "$.trackInfo.data"}*/
    ],
    controllerChanged: function(inProp, inPrev, inVal) {
        if (this.controller && this.controller.get) {
            this.$.trackInfo.controller.add(this.controller.get("tracks")); 
        }
    }
});