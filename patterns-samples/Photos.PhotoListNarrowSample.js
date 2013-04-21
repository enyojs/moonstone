enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    //kind: "FittableRows",
    kind : "moon.Panel",
    style: "background: #eaeaea;",
    classes: "moon enyo-unselectable",
    fit: true,

    handlers: {

    },

    create: function() {
        this.inherited(arguments);
        
        this.setHeader({
            title : "ALBUM",
            index : "02",
            titleBelow : "97 Photos",
        });
    },

    headerComponents : [
    ],

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            style : "width : 350px;",
            fit : true,

            components : [
                {

                    kind : "moon.sample.photos.PhotoListNarrowSample.photoList",
                    style : "margin : 20px 0px 0px 20px;"
                }
            ]
        }

    ]
});

// photo list
enyo.kind({
    name : "moon.sample.photos.PhotoListNarrowSample.photoList",
    kind : "moon.Scroller",
    style : "width:350px;height:550px;",
    touch : true,
    horizontal : "hidden",
    components : [
        {
            kind: "sample.photo.PhotoListItem",
            source: "./assets/default-movie.png",
        },
        {
            kind: "sample.photo.PhotoListItem",
            source: "./assets/default-movie.png",
        },
        {
            kind: "sample.photo.PhotoListItem",
            source: "./assets/default-movie.png",
        },
        {
            kind: "sample.photo.PhotoListItem",
            source: "./assets/default-movie.png",
        },
    ]
});

// phot list item
enyo.kind({
    name: "sample.photo.PhotoListItem",
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