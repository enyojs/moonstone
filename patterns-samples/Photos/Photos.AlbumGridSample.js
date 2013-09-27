// Sample view

enyo.kind({
    name: "moon.sample.photos.AlbumGridSample",
    kind: "moon.Panel",
    classes: "moon enyo-fit enyo-unselectable",
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {name: "gridList", spacing: 20, minWidth: 180, minHeight: 270, kind: "moon.DataGridList", components: [
            {
                kind: "moon.GridListImageItem",
                subCaption: "Sub Caption",
                bindings: [
                    {from: ".model.caption", to: ".caption"},
                    {from: ".model.src", to: ".source"}
                ]
            }
        ]}
    ],
    bindings: [
        {from: ".controller.albums", to: ".$.gridList.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        albums: new enyo.Collection([
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"},
            {src: "../assets/default-music-big.png", caption: "Album Name"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
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
