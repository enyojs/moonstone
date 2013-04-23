enyo.kind({
    name: "moon.sample.photos.AlbumListNarrowSample",
    kind : "moon.Panel",
    style: "background: #eaeaea;",
    classes: "moon enyo-unselectable",
    fit: true,
    title : "ALBUMS",
    titleAbove : "01",
    titleBelow : "",

    create: function() {
        this.inherited(arguments);
    },

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            fit : true,
            components : [
                {
                    kind : "moon.sample.photos.AlbumListNarrowSample.albumList",
                }
            ]
        }

    ]
});

// album list
enyo.kind({
    name : "moon.sample.photos.AlbumListNarrowSample.albumList",
    kind : "moon.Scroller",
    style : "width:400px;height:600px;",
    horizontal : "hidden",
    touch : true,
    components : [
        {
            components : [
                {tag : "br"},
                {
                    kind : "sample.photo.AlbumListItem",
                    source: "./assets/default-movie.png",
                    bgSource : "./assets/bg-movie.png"
                },
                {
                    kind : "sample.photo.AlbumListItem",
                    source: "./assets/default-movie.png",
                    bgSource : "./assets/bg-movie.png"
                },
                {
                    kind : "sample.photo.AlbumListItem",
                    source: "./assets/default-movie.png",
                    bgSource : "./assets/bg-movie.png"
                },
                {
                    kind : "sample.photo.AlbumListItem",
                    source: "./assets/default-movie.png",
                    bgSource : "./assets/bg-movie.png"
                },
                {
                    kind : "sample.photo.AlbumListItem",
                    source: "./assets/default-movie.png",
                    bgSource : "./assets/bg-movie.png"
                }
            ]
        },

    ]
});

// AlbumListItem
enyo.kind({
    name: "sample.photo.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    style : "margin : 0px 0px 80px 0px;",
    components:[
        {
            kind : "FittableColumns",
            components : [
                {
                    style : "margin : 40px 0px 60px 0px;",
                    components : [
                        {
                            name : "bgImage",
                            kind : "enyo.Image",
                            style : "margin: -22px 0px 0px 25px;",
                            components : [
                                {
                                    name : "image",
                                    kind : "enyo.Image",
                                    style : "margin: -216px 0px 0px 0px;",
                                }
                            ]
                        },
                    ]
                },
                {
                    name : "title",
                    style : "margin-left : 10px",
                }
            ]
        }
    ],

    published: {
        source: '',
        bgSource : '',
        title : '',
    },

    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
        this.textChanged();
    },

    sourceChanged: function() {
        if (!this.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.source);
        this.$.bgImage.setAttribute('src', this.bgSource);
    },

    textChanged : function(){
        if (!this.title || this.title === '') {
            return;
        }
        this.$.title.content = this.title;
    }
});