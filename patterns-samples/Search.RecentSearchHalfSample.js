enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.SearchPanel",
	classes: "enyo-unselectable moon moon-search",
    handlers: {
        "onSearch": "search"
    },
    fit: true,
    titleAbove: "02",
    title: "SEARCH",

    components: [
        {kind: "enyo.Spotlight"},
        {
            layoutKind: "FittableRowsLayout",
            fit: true,
            components: [
                {
                    kind: "moon.RadioButtonGroup", 
                    onActivate: "", 
                    components: [
                        {classes : "radio-button", content: "SUGGESTED SEARCH"},
                        {classes : "radio-button", content: "RECENT SEARCHES"},
                        {kind: "moon.IconButton", classes: "icon-button-right", src: "assets/trash-can-icon.png"}
                    ],
                },
                { kind : "moon.Divider", classes : "divider" },
                {              
                    kind: "moon.List",
                    count: 10,
                    fit: true,
                    onSetupItem: "setupItem",
                    components: [
                        {
                            name: "item",
                            layoutKind: "FittableColumnsLayout",
                            classes: "moon-search-recent-list",
                            components: [
                                {name: "itemTitle", fit: true, kind: "moon.Item"},
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
        this.$.itemTitle.setContent("RECENT SEARCH");
        return true;
    }
});
