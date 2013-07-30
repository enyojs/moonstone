enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    kind: "moon.Panel",
    classes: "moon enyo-unselectable enyo-fit photo-album",
    title: "ALBUM",
    titleAbove: "02",
    titleBelow: "97 Photos",
    components: [
        {
            kind: "VFlexBox",
            flex: true,
            components : [
                {                   
                    kind: "moon.Scroller",
                    classes: "enyo-fill",                    
                    touch: true,
                    components : [
                        {
                            name: "menuList",
                            kind: "enyo.DataList",
                            scrollerOptions: {horizontal: "hidden", thumb: false},
                            style: "width: 300px;",
                            components: [
                                {kind: "moon.ImageItem", bindFrom: "imgSrc", bindTo: "source"}
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    bindings: [
        {from: ".controller.menus", to: "$.menuList.controller"}
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
                {kind: "enyo.Spotlight"},
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