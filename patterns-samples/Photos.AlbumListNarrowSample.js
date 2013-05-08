enyo.kind({
    name: "moon.sample.photos.AlbumListNarrowSample",
    kind : "moon.Panel",
    fit: true,
    title : "ALBUMS",
    titleAbove : "01",
    titleBelow : "",
    classes : "photo-overlap-album",
    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            fit : true,
            components : [
                {
                    kind : "moon.Scroller",
                    style : "width:400px;height:600px;",
                    horizontal : "hidden",
                    touch : true,
                    components : [
                        {
                            components : [
                                {
                                    kind : "sample.photo.AlbumListItem",
                                    source: "./assets/default-movie.png",
                                    bgSource : "./assets/bg-movie.png",
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
                        }
                    ]
                }
            ]
        }

    ]
});

enyo.kind({
    name: "sample.photo.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    components:[
        {
            kind : "FittableColumns",
            components : [
                {
                    components : [
                        {
                            name : "bgImage",
                            kind : "enyo.Image",
                            classes : "front-image",
                            components : [
                                {
                                    name : "image",
                                    kind : "enyo.Image",
                                    classes : "back-image",
                                }
                            ]
                        },
                    ]
                },
                {
                    name : "title",
                    classes : "title-text",
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