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
                    components: [
                        {kind: "moon.RadioButtonGroup", components: [
                            {classes: "radio-button", content: "SUGGESTED SEARCH"},
                            {classes: "radio-button", content: "RECENT SEARCHES"},
                        ]},               
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
                            layoutKind: "FittableColumnsLayout",
                            classes: "moon-search-recent-list",
                            components: [
                                {name: "itemTitle", kind: "moon.Item"},
                                {kind: 'enyo.Image', classes: "moon-search-image", src: "assets/album.png"},
                                {kind: 'enyo.Image', classes: "moon-search-image", src: "assets/album.png"}
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
