enyo.kind({
    name: "moon.sample.photos.AlbumListNarrowSample",
    kind: "FittableRows",
    style: "background: #eaeaea;",//" width:350px; overflow:hidden",
    classes: "moon enyo-unselectable",
    fit: true,

    handlers: {

    },

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            style : "width : 350px;",
            fit : true,
            components : [
                {
                    kind : "moon.Header",
                    title : "ALBUMS",
                    titleAbove : "01",
                    style : "padding-left:20px;"
                },
                {
                    kind : "moon.Scroller",
                    style : "width:350px;height:550px;padding: 30px 0px 0px 35px",
                    touch : true,
                    components : [
                        {
                            components : [
                                {
                                    kind : "sample.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png"
                                },
                                {
                                    kind : "sample.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png"
                                },
                                {
                                    kind : "sample.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png"
                                },
                                {
                                    kind : "sample.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png"
                                },
                                {
                                    kind : "sample.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png"
                                }
                            ]
                        },

                    ]

                }
            ]
        }

    ]
});

enyo.kind({
    name: "sample.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    style : "margin : 0px 0px 80px 0px;",
    components:[
        {
            style : "margin : 40px 0px 60px 0px;",
            components : [
                {
                    name : "bgImage",
                    kind : "enyo.Image",
                    style : "margin: -24px 0px 0px 25px;",
                    components : [
                        {
                            name : "image",
                            kind : "enyo.Image",
                            style : "margin: -216px 0px 0px 0px;",
                        }
                    ]
                },
            ]
        }
    ],
    published: {
        source: '',
        bgSource : ''
    },
    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
    },

    sourceChanged: function() {
        if (!this.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.source);
        this.$.bgImage.setAttribute('src', this.bgSource);
    },
});