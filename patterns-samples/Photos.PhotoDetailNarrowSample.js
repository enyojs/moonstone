enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    kind: "moon.Panel",
    classes: "photo-detail",
    fit: true,
    title: "PHOTO NAME",
    titleAbove: "03",
    titleBelow: "2013-04-08",
    
    headerComponents : [
        {kind: "moon.IconButton", style: "border:none;", src: "assets/icon-favorite.png"},
        {kind: "moon.IconButton", style: "border:none;", src: "assets/icon-download.png"},
        {kind: "moon.IconButton", style: "border:none;", src: "assets/icon-next.png"},
    ],

    components: [
        {
            //bindFrom: "src"
            name: "photoDetail",
            kind: "enyo.Image",
            src: "",
            //ontap: "changImage",
            style: "width:600px;height:400px;"
        }
    ],
    bindings: [
        {from: ".controller.src", to: "$.photoDetail.src"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        src: "./assets/default-movie.png"
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
                model: sampleModel,
                changImage: function(inSender, inEvent) {
                    enyo.log("Item: " + inEvent.originator.parent.controller.model.get("menuItem"));
                }
            }
        ]
    });
});