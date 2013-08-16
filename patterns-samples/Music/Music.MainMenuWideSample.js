// Sample view

enyo.kind({
    name: "moon.sample.music.MainMenuWideSample",
    kind: "moon.Panel",
    titleAbove: "01",
    title: "Main Menu",
    titleBelow: "",
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
                        {kind: "moon.Item", bindings: [
							{from: ".model.name", to: ".content"}
						]}
                    ]
                },
                {
                    content: "branding",
                    fit: true,
                    classes: "moon-dark-gray",
                    style: "text-align: center"
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.menu", to: ".$.menus.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
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
                    kind: "moon.sample.music.MainMenuWideSample",
                    controller: ".app.controllers.menuController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "menuController", 
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});