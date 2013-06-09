/**
    _moon.SearchHeader_ is a control that have narrow title and search box area
    with Moonstone styling applied..
*/
enyo.kind({
    //* @public
    name: "moon.SearchHeader",
    kind: "moon.Header",
    events: {
        "onSearch": ""
    },
    //* @protected
    classes: "moon-searchheader",
    components: [
        {name: "titleAbove", classes: "moon-searchheader-title-above"},
        {name: "title", classes: "moon-searchheader-title"},
        {name: "titleBelow", kind: "moon.Item", spotlight: false, classes: "moon-searchheader-title-below"},
        {name: "searchInputContainer", kind: "FittableColumns", classes: "moon-searchheader-container", style: "width: 100%;", components: [
            {classes: "moon-searchheader-search-left"},
            {kind: "moon.InputDecorator", layoutKind: "FittableColumnsLayout", fit: true, components: [
                {name: "searchInput", kind: "moon.Input", oninput: "search", fit: true, placeholder: "Search term"},
                {kind: "Image", src: "../samples/assets/search-input-search.png", style: "width: 20px;height:20px;margin-left:10px;"}
            ]},
            {classes: "moon-searchheader-search-right"},
        ]},
        {name: "client", classes: "moon-header-client"},
        {name: "animator", kind: "StyleAnimator", onComplete: "animationComplete"}
    ],

    //* @public

    search: function() {
        this.doSearch({"keyword": this.$.searchInput.getValue()});
    }
});
