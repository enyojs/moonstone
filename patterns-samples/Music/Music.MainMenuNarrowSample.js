// Sample view

enyo.kind({
    name: "moon.sample.music.MainMenuNarrowSample",
    kind: "moon.Panels",
    pattern: "alwaysviewing",
    classes: "moon-neutral",  // TODO: this should be applied automatically by moon.Panels for alwaysviewing
    components: [
        {
            kind: "moon.Panel",
            titleAbove: "01",
            title: "Main Menu",
            titleBelow: "",
            components: [
                {
                    kind: "moon.DataList",
                    name: "menus",
                    components: [
		                {kind: "moon.Item", bindings: [
							{from: ".model.name", to: ".content"}
						]}
                    ]
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
            {name: "Browse video", open: "enyo.BrowseVideo", options: {}},
            {name: "Browse photos", open: "enyo.BrowsePhotos", options: {}},
            {name: "Browse music", open: "enyo.BrowseMusic", options: {}}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            style: "background-image: url(../assets/livetv-background.png); background-size: 100% 100%;",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.MainMenuNarrowSample",
                    controller: ".app.controllers.menuController",
                    classes: "enyo-fit",
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
