// Sample view

enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    kind: "moon.Panel",
    classes: "photo-detail",
    fit: true,
    title: "PHOTO NAME",
    titleAbove: "03",
    titleBelow: "2013-04-08",

    headerComponents : [
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],

    components: [
        {
            name: "photoDetail",
            kind: "enyo.Image",
            classes: "moon-8h moon-3v",
            src: ""
        }
    ],
    bindings: [
        {from: ".controller.src", to: ".$.photoDetail.src"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        src: "../assets/default-movie.png"
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.photos.PhotoDetailNarrowSample",
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