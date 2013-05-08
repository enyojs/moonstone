enyo.kind({
    //* @public
    name: "moon.sample.search.RecentSearchFullSample",
    kind: "moon.Panel",
    //* @protected
    fit: true,
    titleAbove: "02",
    title: "Search",
    classes: "moon enyo-unselectable moon-sample-search-RecentSearchFullSample", 
    headerComponents: [
        {kind: "moon.IconButton", classes: "moon-header-delete-button", src: "assets/trash-can-icon.png"}
    ],
    components: [
        {kind: "enyo.Spotlight"},
        {kind: "FittableColumns", classes: "moon-header-search", style: "width: 100%;", components: [
            {classes: "moon-header-search-left"},
            {kind: "moon.InputDecorator", fit: true, style: "", components: [
                {kind: "moon.Input", placeholder: "Search term", onchange: "inputChanged"},
                {kind: "Image", src: "../samples/assets/search-input-search.png"}
            ]},
            {classes: "moon-header-search-right"},
        ]},
        {name: "container", kind: "Repeater", onSetupItem: "setupItem", count: 6,  classes: "categories", components: [
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
        {name: "items", kind: "Repeater", onSetupItem: "setupItem", count: 3,  components: [
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
