enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.InputPanel",
	classes: "moon-search",
    handlers: {
        onSearch: ""
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
                            {classes: "radio-button", content: "RECENT SEARCHES"},
                        ]},               
                        {kind: "moon.IconButton", classes: "icon-button-right", src: "assets/trash-can-icon.png"}
                    ],
                },
                { kind : "moon.Divider", classes : "divider" },
                {
                    name: "searchList",
                    kind: "moon.DataList",
                    fit: true,
                    components: [
                        {
                            classes: "moon-search-recent-list",
                            components: [
                                {kind: "moon.Item", style: "display: inline-block", bindFrom: "title"},
                                {kind: 'enyo.Image', classes: "moon-search-image", bindFrom: "imgSrc", bindTo: "src"},
                                {kind: 'enyo.Image', classes: "moon-search-image", bindFrom: "imgSrc", bindTo: "src"}
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.listItems", to: "$.searchList.controller"},
    ]
});

// Settings Main Menu Model
enyo.ready(function(){
    var menuModel = new enyo.Model({
        listItems: new enyo.Collection([
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"},
           {title: "RECENT SEARCH", imgSrc: "assets/album.png"}
        ])
    });

//  Application to render sample
    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
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
