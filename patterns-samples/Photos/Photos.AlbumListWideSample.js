// Sample view

enyo.kind({
    name: "moon.sample.photos.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    published: {
        option: {
            source: "",
            title: ""
        }
    },
    components:[
        {
            classes: "moon-hspacing top",
            components: [
                {
                    components: [
                        {name: "image", kind: "enyo.Image"}
                    ]
                },
                {
                    name: "title",
                    classes: "title-text"
                }
            ]
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.optionChanged();
    },
    optionChanged: function() {
        if (!this.option.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.option.source);
        this.$.title.content = this.option.title;
    }
});


enyo.kind({
    name: "moon.sample.photos.AlbumListWideSample",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    titleAbove: "01",
    title: "ALBUMS",
    titleBelow: "",
    components: [
        {
            name: "menuList",
            kind: "moon.DataList",
            classes: "moon-7h",
            components: [
                {
                    kind: "moon.sample.photos.AlbumListItem",
                    bindings: [
                        {from: ".model.option", to: ".option"}
                    ]
                }
            ]
        },
        {
            name: "albumList",
            minWidth: 136, 
            kind: "moon.DataGridList",
            fit: true,
            components: [
                {
                    kind: "moon.GridListImageItem",
                    bindings: [
                        {from: ".model.imgSrc", to: ".source"}
                    ]
                }
            ]
        }
    ],

    bindings: [
        {from: ".controller.menus", to: ".$.menuList.controller"},
        {from: ".controller.albums", to: ".$.albumList.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        menus: new enyo.Collection([
            {option: {source: "../assets/default-movie.png", title: "Album Name 1"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name 2"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name 3"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name 4"}}
        ]),
        albums: new enyo.Collection([
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"},
            {imgSrc: "../assets/album.png"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.photos.AlbumListWideSample",
                    controller: ".app.controllers.photoController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "photoController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});
