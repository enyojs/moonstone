enyo.kind({
    name: "moon.sample.search.RecentSearchHalfSample",
    kind: "moon.Panel",
    titleAbove: "02",
    title: "SEARCH",
    titleBelow: "",
    events: {
        onChangeName:""
    },
    headerComponents: [
        /* Fixme: moon.Panel needs interface to change Header, Body, Tools area size */
        {kind: "moon.InputDecorator", components: [
            {style: "width: 500px", components: [
                {layoutKind: 'FittableColumnsLayout', components: [
                    {kind: "moon.Input", placeholder: "Search term", fit: true, onchange: "inputChanged"},
                    {kind: "Image", src: "../../samples/assets/search-input-search.png", classes: "moon-search-result-image"}
                ]}
            ]}
        ]}
    ],
    components: [
        {
            /* Fixme: enyo.DataList should be changed to moon.DataGrid to support scroll */
            kind: "moon.DataGridList",
            name: "resultInfo",
            spacing: 20, 
            minWidth: 250, 
            minHeight: 200,
            components: [
                {                  
                    kind: "moon.GridListImageItem", 
                    ontap: "changeName",
                    bindings: [
                        {from: ".model.caption", to: ".caption"},
                        {from: ".model.src", to: ".source"}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.result", to: ".$.resultInfo.collection"}
    ],
    changeName: function(inSender, inEvent) {
        this.doChangeName({index:inEvent.index});
    }
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        result: new enyo.Collection([
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"},
            {src: "../assets/default-movie.png", caption: "Person name"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {name:"searchView", kind: "moon.sample.search.RecentSearchHalfSample", classes:"enyo-fit"}
            ]
        },
        components: [
            {
                name: "searchController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ],
        bindings: [
            {from:".$.searchController", to:".view.$.searchView.controller"}
        ],
        handlers: {
            onChangeName: "changeName"
        },
        changeName: function(inSender, inEvent) {
            this.$.searchController.get("model").get("result").at(inEvent.index).set("caption", "New name set");
        }
    });
});