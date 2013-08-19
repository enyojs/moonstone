// Sample view

enyo.kind({
    name: "moon.sample.photo.AlbumListItem",
    classes: "moon-album-list-item moon-3h moon-1v",
    
    published: {
        option: {
            src: "",
            bgSrc: "",
            caption: ""
        }        
    },

    components:[
        {
            kind : "FittableColumns",
            components : [
                {
                    components : [
                        {
                            name : "bgImage",
                            kind : "enyo.Image",
                            classes : "front-image moon-3h moon-1v",
                            components : [
                                {
                                    name : "image",
                                    kind : "enyo.Image",
                                    classes : "back-image moon-3h moon-1v"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.optionChanged();
    },

    optionChanged: function(inOld) {
        this.$.image.setAttribute('src', this.option.src);
        this.$.bgImage.setAttribute('src', this.option.bgSrc);
    }
});

enyo.kind({
    name: "moon.sample.photos.AlbumGridSample",
    kind: "moon.Panel",
    classes: "moon enyo-fit enyo-unselectable",
    titleAbove: "01",
    title: "Main Menu",

    components: [
        {
            kind: "FittableRows",
            fit: true,
            components: [
                {                   
                    kind: "moon.Scroller",
                    classes: "enyo-fill",                    
                    touch: true,
                    components: [
                        {
                            name: "menuList",
                            kind: "enyo.DataGridList",
                            scrollerOptions: {horizontal: "hidden", thumb: false},
                            components: [
                                {
                                    kind: "moon.sample.photo.AlbumListItem",
                                    bindings: [
										{from: ".model.imgOption", to: ".option"}
									]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    bindings: [
        {from: ".controller.menus", to: ".$.menuList.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        menus: new enyo.Collection([
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}},
            {imgOption: {src: "../assets/default-movie.png", bgSrc: "../assets/bg-movie.png", caption: "Album Name"}}
        ])        
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.photos.AlbumGridSample",
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
