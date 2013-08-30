enyo.kind({
    name: "moon.sample.video.MainMenuNarrowSample",
    kind: "moon.Panel",
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {
            name: "menuList",
            kind: "enyo.DataList",
            components: [
                { kind: "moon.Item", ontap: "changePanel", bindings: [
                    {from: ".model.menuItem", to: ".content"}
                ]}
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
            {menuItem: "Browse Movies"},
            {menuItem: "Browse TV Shows"},
            {menuItem: "Queue"},
            {menuItem: "Search"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.video.MainMenuNarrowSample",
                    controller: ".app.controllers.movieController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "movieController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changePanel: function(inSender, inEvent) {
                    enyo.log("Item: " + inEvent.originator.parent.controller.model.get("menuItem"));
                }
            }
        ]
    });
});
