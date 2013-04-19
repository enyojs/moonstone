enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    kind: "FittableRows",
    style: "background: #eaeaea;",//" width:350px;",//overflow:hidden;",
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
                    allowHtml : true,
                    title : "ALBUM",
                    titleAbove : "02",
                    titleBelow : "97 Photos",
                    style : "padding-left:20px;",

                    components : [
                        //{ content : "NAME", classes : "moon-header-title", style : "text-align:left;position:relative;top:-25px;"  },
                        //{ content : "97 Photos", style : "font-size:24px" }
                    ]
                },
                {
                    kind : "moon.Scroller",
                    style : "width:350px;height:550px;padding: 20px 0px 0px 10px",
                    touch : true,
                    components : [
                        {
                            kind: "sample.PhotoListItem",
                            source: "./assets/default-movie.png",
                        },
                        {
                            kind: "sample.PhotoListItem",
                            source: "./assets/default-movie.png",
                        },
                        {
                            kind: "sample.PhotoListItem",
                            source: "./assets/default-movie.png",
                        },
                        {
                            kind: "sample.PhotoListItem",
                            source: "./assets/default-movie.png",
                        },
                    ]

                }
            ]
        }

    ]
});

enyo.kind({
    name: "sample.PhotoListItem",
    classes: "sample-photo-list-item",
    kind: "moon.Item",
    components:[
        {
            name: 'image', 
            kind: 'enyo.Image',
        }
    ],
    published: {
        source: '',
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
    },
});