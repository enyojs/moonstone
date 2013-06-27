// Sample view

enyo.kind({
    name: "moon.SearchResultImageItem",
    classes: "moon-search-result-item",
    spotlight: true,
    published: {
        option: {
            src: "",
            caption: ""    
        }
    },
    handlers: {
        onSpotlightFocused: "focused",
        onSpotlightBlur: "released"
    },
    components: [
        {name: "caption", classes: "moon-search-result-item-text"}
    ],
    create: function() {
        this.inherited(arguments);
        this.optionChanged();
    },
    getCaption: function() {
        return this.$.caption;
    },
    optionChanged: function(inOld) {
        this.applyStyle("background-image", 'url(' + this.option.src + ')');
        this.$.caption.setContent(this.option.caption);
    },
    focused: function() {
        this.$.caption.addClass("spotlight");
        return true;
    },
    released: function() {
        this.$.caption.removeClass("spotlight");
        return true;
    }
});

enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.Panel",
    titleAbove: "02",
    title: "SEARCH",
    titleBelow: "",
    headerComponents: [
        /* Fixme: moon.Panel needs interface to change Header, Body, Tools area size */
        {kind: "moon.InputDecorator", components: [
            {style: "width: 500px", components: [
                {layoutKind: 'HFlexLayout', components: [
                    {kind: "moon.Input", placeholder: "Search term", flex: true, onchange: "inputChanged"},
                    {kind: "Image", src: "../../samples/assets/search-input-search.png"}
                ]}
            ]}
        ]}
    ],
    components: [
        {
            /* Fixme: enyo.DataList should be changed to moon.DataGrid to support scroll */
            kind: "enyo.DataList",
            name: "resultInfo",
            components: [
                {
                    kind: "moon.SearchResultImageItem", 
                    bindFrom: "option", 
                    bindTo: "option",
                    ontap: "changeName"
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.result", to: "$.resultInfo.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        result: new enyo.Collection([
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}},
            {option: {src: "../assets/default-movie.png", caption: "Person name"}}
        ])
    });
 
//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.search.RecentSearchHalfSample",
                    controller: ".app.controllers.searchController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "searchController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeName: function(inSender, inEvent) {
                    inSender.getCaption().setContent("Selected");
                }
            }
        ]
    });
});