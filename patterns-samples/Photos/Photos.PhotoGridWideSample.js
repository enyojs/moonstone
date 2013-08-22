// Sample view

enyo.kind({
    name: "moon.sample.photos.PhotoGridSample",
    kind: "moon.Panel",
    classes: "moon enyo-fit",
    titleAbove: "02",
    title: "Album Name",
    titleBelow: "97 Photos",

    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-list.png"},
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],

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
                                    kind: "enyo.Image",
                                    classes: "moon-3h moon-1v",
									bindings: [{from: ".model.imgSrc", to: ".src"}]
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
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"},
            {imgSrc: "../assets/default-movie.png"}
        ])        
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.photos.PhotoGridSample",
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