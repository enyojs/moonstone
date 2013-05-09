enyo.kind({
    //* @public
    name: "moon.sample.search.RecentSearchFullSample",
    kind: "moon.SearchPanel",
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
        {name: "container", kind: "Repeater", onSetupItem: "setupItem", count: 6, classes: "categories", components: [
            {kind:"moon.sample.search.recent.category"}
        ]}
    ],

    //* @public

    // Do something
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
