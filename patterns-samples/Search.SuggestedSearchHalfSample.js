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
            ]
        }
    ]
});
