enyo.kind({
    //* @public
    name: "moon.sample.search.RecentSearchFullSample",
    kind: "FittableRows",
    //* @protected
    fit: true,
    classes: "moon enyo-unselectable" /* + "background-full-image" */, 
    components: [
        {kind: "enyo.Spotlight"},
        {classes: "left-panel", components: [
            {classes: "left-panel-content", components: [
                {content: "01", classes: "left-panel-number"},
                {content: "MAIN MENU", classes: "left-panel-title"}
            ]}
        ]},
        {classes: "right-panel", components: [
             {
                name: "",
                kind: "moon.Panel",
                titleAbove: "02",
                title: "Search",
                classes: "moon-sample-search-RecentSearchFullSample",
                headerComponents: [
                    {kind: "moon.IconButton", classes: "moon-header-delete-button", src: "assets/trash-can-icon.png"}
                ],
                components: [
                    {kind: "FittableColumns", classes: "moon-header-search", style: "width: 100%;", components: [
                        {classes: "moon-header-search-left"},
                        {kind: "moon.InputDecorator", fit: true, style: "", components: [
                            {kind: "moon.Input", placeholder: "Search term", onchange: "inputChanged"},
                            {kind: "Image", src: "../samples/assets/search-input-search.png"}
                        ]},
                        {classes: "moon-header-search-right"},
                    ]},
                    {name: "container", classes: 'body-container'},
                ]         
            }
        ]}
    ],

    initComponents: function() {
        var length = 6;
        this.inherited(arguments);
        for (var i=0; i<length; i++) {
            this.$.container.createComponent({
                name: "item"+i, kind: "moon.sample.search.recent.category", 
                categoryName: "RECENT SEARCH", 
                items: [
                    {text: "RESULT", imageSrc: './assets/default-movie.png'},
                    {text: "RESULT", imageSrc: './assets/default-movie.png'},
                    {text: "RESULT", imageSrc: './assets/default-movie.png'}
                ],
                classes: 'search-recent-category'
            });
        }
    }

    //* @public

    // Do something
});

enyo.kind({
    //* @public
    name: "moon.sample.search.recent.category",
    published: {
        //* Category title
        categoryName: "",
        //* The items of a category
        items: "",
    },
    //* @protected
    classes: "category",
    components: [
        {name: "title", kind: "moon.Item", spotlight: true, classes: 'category-name'},
    ],

    initComponents: function() {
        this.inherited(arguments);
        this.$.title.setContent(this.categoryName);
        if (this.items instanceof Array) {
            for (var item in this.items) {
                this.createComponent({
                    classes: 'item', spotlight: true, style: "background-image: url(" + (this.items[item])['imageSrc'] + ");", components: [
                        {content: (this.items[item])['text'], classes: "item-text"}
                    ]
                });
            }
        }
    }

    //* @public

    // Do something
});               
