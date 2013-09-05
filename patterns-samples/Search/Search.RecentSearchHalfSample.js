enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.Panel",
    headerOption: {kind:"moon.InputHeader"},
    classes: "moon-search",
    handlers: {
        "onInputChanged": "onInputChanged"
    },
    titleAbove: "02",
    title: "SEARCH",

    components: [
        {
            layoutKind: "FittableRowsLayout",
            fit: true,
            components: [
                {
                    components: [
                        {kind: "moon.RadioItemGroup", components: [
                            {classes: "radio-button", content: "SUGGESTED SEARCH"},
                            {classes: "radio-button", content: "RECENT SEARCHES"}
                        ]},
                        {kind: "moon.IconButton", classes: "icon-button-right", src: "../assets/trash-can-icon.png"}
                    ]
                },
                { kind : "moon.Divider", classes : "divider" },
                {
                    name: "searchList",
                    kind: "moon.DataList",
                    fit: true,
                    components: [
                        {
                            classes: "moon-search-recent-list",
                            bindings: [
                                {from: ".model.title", to: ".$.item.content"},
                                {from: ".model.imgSrc", to: ".$.image1.src"},
                                {from: ".model.imgSrc", to: ".$.image2.src"}
                            ],
                            components: [
                                {kind: "moon.Item", name: "item", style: "display: inline-block" },
                                {kind: "enyo.Image", name: "image1", classes: "moon-search-image" },
                                {kind: "enyo.Image", name: "image2", classes: "moon-search-image" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.listItems", to: ".$.searchList.controller"}
    ]
});
// Settings Main Menu Model
enyo.ready(function(){
    var menuModel = new enyo.Model({
        listItems: new enyo.Collection([
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"},
            {title: "RECENT SEARCH", imgSrc: "../assets/album.png"}
        ])
    });

//  Application to render sample
    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.search.RecentSearchHalfSample",
                    controller: ".app.controllers.RecentSearchController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "RecentSearchController",
                kind: "enyo.ModelController",
                model: menuModel,
                changeItemName: function(inSender, inEvent){
     //               inSender.parent.controller.set("name", "Changed");
                }
            }
        ]
    });
});
