// Sample view

enyo.kind({
    name: "moon.sample.music.MainMenuWideSample2",
    kind: "moon.Panel",
    titleAbove: "01",
    title: "Main Menu",
    titleBelow: "",
    classes: "livetv-background",
    components: [
        {
            kind: "FittableColumns",
            fit: true,
            components: [
                {
                    kind: "moon.DataList",
                    name: "menus",
                    classes: "moon-5h",
                    components: [
                        {kind: "moon.Item", ontap: "onTap", bindFrom: "name"}
                    ]
                },
                {
                    fit: true,
                    kind: "enyo.VCenter",
                    classes: "moon-dark-gray moon-music-mainmenu-branding",
                    content: "branding"
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.menu", to: "$.menus.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel0 = new enyo.Model({
        menu: new enyo.Collection([
            {name: "Browser video"},
            {name: "Browser photos"},
            {name: "Browser music"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.MainMenuWideSample2",
                    controller: ".app.controllers.menuController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "menuController", 
                kind: "enyo.ModelController",
                model: sampleModel0,
                onTap: function(inSender, inEvent) {
                    console.log("on Menu Tap: " + inEvent.originator.name);
                }
            }
        ]
    });
});