// Sample view

enyo.kind({
    name: "moon.sample.music.LyricsDetailSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "LYRICS",
    titleBelow: "",
    components: [
        {
            kind: "moon.Scroller",
            fit: true,
            components: [
                {kind:"moon.BodyText", name: "lyrics", allowHtml: true}
            ]
        }
    ],
    bindings: [
        {from: ".controller.lyrics", to: ".$.lyrics.content"}
    ]
});

enyo.ready(function() {
    var sampleModel = new enyo.Model({
        lyrics:  "<p>Can't see the lights or the blue orange signs "
                + "Can't see the road or the long white lines "
                + "Feeling the ground through the pedals in the floor "
                + "Feeling death pounding at the door</p>"

                + "<p>Windows all open, chaos in my hair "
                + "Driving me 'round and leaving me there "
                + "Cover my eyes and we'll die driving blind "
                + "Cover my trail and we'll leave life behind</p> "

                + "<p>Drive blind, all at once, too much light "
                + "Captured and frozen, hear no sound "
                + "Bright flashes penetrate "
                + "Glowing, flowing, lifting off the ground<p> "
    });

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.music.LyricsDetailSample",
                    controller: ".app.controllers.lyricController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "lyricController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});