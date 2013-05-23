enyo.kind({
    //* @public
    name: "moon.sample.search.RecentSearchFullSample",
    kind: "moon.SearchPanel",
    handlers: {
        "onSearch": "search"
    },
    //* @protected
    fit: true,
    titleAbove: "02",
    title: "Search",
    spotlight: false,
    classes: "moon enyo-unselectable moon-sample-search-RecentSearchFullSample", 
    headerComponents: [
        {kind: "moon.IconButton", classes: "moon-header-delete-button", src: "assets/trash-can-icon.png"}
    ],
    components: [
        {kind: "enyo.Spotlight"},
        {name: "recentResult", kind: "Repeater", count: 6, classes: "categories", components: [
            {kind: "moon.sample.search.recent.category"}
        ]},
/*        {name: "searchResult", components: [
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
        ]}*/
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
    name: "moon.sample.search.recent.category",
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
