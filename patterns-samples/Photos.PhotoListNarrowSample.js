enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    kind : "moon.Panel",
    classes: "moon enyo-unselectable",
    fit: true,
    title : "ALBUM",
    titleAbove : "02",
    titleBelow : "97 Photos",

    create: function() {
        this.inherited(arguments);
    },

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            fit : true,
            classes : "sample-photo-narrow-list",   
            components : [
                {                   
                    kind : "moon.sample.photos.PhotoListNarrowSample.photoList",
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