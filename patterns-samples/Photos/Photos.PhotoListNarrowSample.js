enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    kind: "moon.Panel",
    classes: "moon enyo-unselectable enyo-fit photo-album",
    title: "ALBUM",
    titleAbove: "02",
    titleBelow: "97 Photos",
    components: [
        {
            kind: "moon.Scroller",
            classes: "enyo-fill",
            touch: true,
            components : [
                {
                    name: "menuList",
                    kind: "moon.DataList",
                    style: "width: 300px;",                            
                    components: [
                        {
                            kind: "moon.Item", 
                            classes: "sample-album-list-item", 
                            bindings: [
                                {from: ".model.imgSrc", to: ".$.image.src"}
                            ],
                            components: [
                                {name: "image", kind: "enyo.Image"}
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
            {imgSrc: "../assets/default-movie.png"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.photos.PhotoListNarrowSample",
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