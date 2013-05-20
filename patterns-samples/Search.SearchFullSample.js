enyo.kind({
    //* @public
    name: "Search.SearchFullSample",
    kind: "moon.SearchPanel",
    handlers: {
        "onSearch": "search"
    },
    //* @protected
    fit: true,
    title: "Search",
    spotlight: false,
    classes: "moon-sample-search-RecentSearchFullSample", 
    headerComponents: [
        {kind: "moon.IconButton", classes: "moon-header-delete-button", src: "assets/trash-can-icon.png"}
    ],
    components: [
        {name: "recentResult", kind: "Repeater", count: 6, classes: "categories", components: [
            {kind: "Search.RecentSearchFullSample"}
        ]},
        {name: "searchResult", components: [
            {
                name: "gridlist", kind: "moon.GridList",
                onSetupItem: "setupGridItem",
                fit: true, count: 0, toggleSelected: true,
                itemWidth: 200, itemHeight: 130, itemSpacing: 20,
                classes: "grid-list", 
                components: [
                    {name: "gridItem", kind: "moon.GridList.ImageItem"}
                ]
            }
        ]}
    ],
    setupGridItem: function(inSender, inEvent) {
        var i = inEvent.index;

        this.$.gridItem.setSource("assets/default-movie.png");
        this.$.gridItem.setCaption("RESULT");
        this.$.gridItem.setSelected(this.$.gridlist.isSelected(i));

        return true;
    },

    //* @public

    search: function(inSender, inEvent) {
        // console.log("[moon.SearchPanel] onSearch Event - search keyword : " + inEvent.keyword);

        if(inEvent.keyword != "") {
            this.$.recentResult.setShowing(false);
            this.$.gridlist.setCount(20);
            this.$.gridlist.resized();
        } else {
            this.$.recentResult.setShowing(true);
            this.$.gridlist.setCount(0);
            this.$.gridlist.resized();
        }
    }
});

enyo.kind({
    //* @public
    name: "Search.RecentSearchFullSample",
    //* @protected
    classes: "category",
    components: [
        {name: "title", kind: "moon.Item", classes: "category-name"},
        {name: "items", kind: "Repeater", onSetupItem: "setupItem", count: 3, components: [
            {name: "item", spotlight: true, classes: "item", components: [
                {name: "itemText", classes: "item-text"}
            ]}
        ]}
    ],

    initComponents: function() {
        this.inherited(arguments);
        this.$.title.setContent("RECENT SEARCH");
    },
    setupItem: function(inSender, inEvent) {
        var item = inEvent.item;
        item.$.item.applyStyle("background-image", "url('./assets/default-movie.png');");
        item.$.itemText.setContent("RESULT");
        return true;
    }

    //* @public

    // Do something
});               

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        recentSearchResults: new enyo.Collection([
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            },
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            },
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            },
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            },
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            },
            {
                title:"RECENT SEARCH1",
                itemText1:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText2:"RESULT1", itemSource:"./assets/default-movie.png",
                itemText3:"RESULT1", itemSource:"./assets/default-movie.png"
            }            
        ]),
        instantSearchResults: new enyo.Collection([
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"},
            {itemText:"RESULT2", itemSource:"./assets/default-movie.png"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "Search.SearchFullSample",
                    controller: ".app.controllers.searchFullController",
                    classes: "enyo-fit"
                }
            ],
        },
        controllers: [
            {
                name: "searchFullController",
                kind: "enyo.ModelController",
                model: sampleModel,
                // changeTrackName: function(inSender, inEvent) {
                //     inSender.parent.controller.set("name", "We are the Champions");
                // }
            }
        ]
    });
});
