// Sample view

enyo.kind({
    name: "moon.sample.music.RelatedVideosNarrowSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Related Videos",
    titleBelow: "n Videos",
    components: [
        {
            name: "videoInfo",
            kind: "moon.DataList",
            scrollerOptions: { kind:"moon.Scroller", horizontal: "hidden" },
            fit: true,
            components: [
                {
                    bindings: [
                        {from: ".model.coverUrl", to: ".$.enyoImage.src"},
                        {from: ".model.title", to: ".$.imageTitle.content"},
                        {from: ".model.time", to: ".$.imageTime.content"}
                    ],
                    components: [                    
                        {kind: "moon.Item", ontap: "changeName", layoutKind: "FittableColumnsLayout", components: [
                            {name: "enyoImage", kind: "enyo.Image", style: "width: 170px; height: 126px; padding-right: 30px;"},
                            {components: [
                                {name: "imageTitle"},
                                {name: "imageTime", classes: "moon-superscript"}
                            ]}
                        ]}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.videos", to: ".$.videoInfo.controller"}
    ]
});

// Sample model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        videos: new enyo.Collection([
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"},
            {coverUrl: "../assets/default-movie.png", title: "video title", time: "3:40"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.RelatedVideosNarrowSample",
                    controller: ".app.controllers.videoController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "videoController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeVideoName: function(inSender, inEvent) {
                    inSender.parent.controller.set("title", "Good video");
                }
            }
        ]
    });
});
