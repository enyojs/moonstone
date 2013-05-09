enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-search",
    fit: true,
    titleAbove: "02",
    title: "SEARCH",

    headerComponents: [
         {kind: "FittableColumns", components: [
            {kind: "moon.InputDecorator", fit: true, style: "", components: [
                {kind: "moon.Input", placeholder: "Search term", onchange: "inputChanged"},
                {kind: "Image", src: "../samples/assets/search-input-search.png"}
            ]},
        ]}
    ],

    components: [
        {kind: "enyo.Spotlight"},
        {
            layoutKind: "FittableRowsLayout",
            fit: true,
            components: [
                {
                    layoutKind: "FittableColumnsLayout",
                    components: [
                        {kind: "moon.Divider", classes: "moon-search-devider", content: "SUGGESTED SEARCH"},
                        {kind: "moon.Divider", fit: true, classes: "moon-search-devider", content: "RECENT SEARCHES"},
                        {kind: "moon.Divider", classes: "moon-search-button", components: [
                            {kind: "moon.IconButton", src: "assets/icon-round-delete.png", classes: "moon-search-button-right"},
                        ]},
                    ]
                },
                {
                    kind: "moon.List",
                    count: 10,
                    fit: true,
                    onSetupItem: "setupItem",
                    components: [
                        {
                            layoutKind: "FittableColumnsLayout",
                            fit: true,
                            classes: "moon-search-recent-list",
                            components: [
                                {name: "name"},
                                {kind: 'enyo.Image', classes: "moon-search-images", src: "assets/album.png"},
                                {kind: 'enyo.Image', classes: "moon-search-images", src: "assets/album.png"},
                            ]
                        }
                    ]
                }
            ]
        }
    ],

    setupItem: function(inSender, inEvent) {
        this.$.name.setContent("RECENT SEARCH");
    }
});
