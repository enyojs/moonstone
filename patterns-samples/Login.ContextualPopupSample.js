// Sample view

enyo.kind({
    name: "moon.sample.login.ContextualPopupSample",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "menuList",
            kind: "enyo.DataList",
            style: "width: 300px;",
            components: [
                {bindFrom: "menuItem", kind: "moon.Item", ontap: "changePanel"}
            ]
        },
        {
            name: "contentList",            
            kind: "enyo.DataList",
            fit: true,
            components: [
                {kind: "moon.ImageItem", bindFrom: "imgSrc", bindTo: "source"}
            ]
        }
    ],
    bindings: [
        {from: ".controller.menus", to: "$.menuList.controller"},
        {from: ".controller.contents", to: "$.contentList.controller"}
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
        ]),
        contents: new enyo.Collection([
            {imgSrc: "assets/default-movie-vertical.png"},
            {imgSrc: "assets/default-movie-vertical.png"},
            {imgSrc: "assets/default-movie-vertical.png"},
            {imgSrc: "assets/default-movie-vertical.png"}            
        ]),
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.login.ContextualPopupSample",
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