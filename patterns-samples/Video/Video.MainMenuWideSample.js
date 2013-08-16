enyo.kind({
    name: "moon.sample.video.MainMenuWideSample",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {
            name: "menuList",
            kind: "enyo.DataList",
            style: "width: 300px;",
            components: [
                {kind: "moon.Item", ontap: "changePanel", bindings: [
                    {from: ".model.menuItem", to: ".content"}
                ]}
            ]
        },
        {
            fit: true,
            classes: "moon-dark-gray",
            content: "branding"
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
            {menuItem: "Browser Movies"},
            {menuItem: "Browser TV Shows"},
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
                    kind: "moon.sample.video.MainMenuWideSample",
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
