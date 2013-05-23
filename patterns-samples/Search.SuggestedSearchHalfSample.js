enyo.kind({
    name: "moon.sample.search.SuggestedSearchHalfSample",
    kind: "moon.SearchPanel",
	classes: "enyo-unselectable moon moon-search",
    handlers: {
        onSearch: ""
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
                        ]}
                    ],
                },
                { kind : "moon.Divider", classes : "divider" },
                {
                    name: "suggestedResult", 
                    kind: "Repeater", 
                    count: 6, 
                    components: [
                        {kind: "moon.sample.search.suggested.category"}
                    ]
                },
            ]
        }
    ],
});

enyo.kind({
    //* @public
    name: "moon.sample.search.suggested.category",
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
});               

