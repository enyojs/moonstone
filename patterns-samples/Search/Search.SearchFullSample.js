// Search.SearchDrawer
enyo.kind({
    //* @public
    name: "moon.sample.search.SearchFullSample",
    kind: "moon.Panel",
    controller: ".app.controllers.searchDrawerController",
    headerOptions: {kind: "moon.InputHeader", components: [
        {kind: "moon.IconButton", src: "../assets/trash-can-icon.png"}
    ]},
    handlers: {
        "onInputHeaderInput": "onInputChanged"
    },

    //* @protected
    spotlight: false,

    components: [
        {name: "recentResult", kind: "moon.Scroller", fit:true, components: [
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title1", kind: "moon.Item"},
                {name: "recentSearchResults1", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title2", kind: "moon.Item"},
                {name: "recentSearchResults2", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title3", kind: "moon.Item"},
                {name: "recentSearchResults3", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title4", kind: "moon.Item"},
                {name: "recentSearchResults4", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title5", kind: "moon.Item"},
                {name: "recentSearchResults5", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title6", kind: "moon.Item"},
                {name: "recentSearchResults6", kind: "enyo.DataGridList", classes: "result-height", components: [
                    {kind: "moon.GridListImageItem", bindings: [
                        {from: ".model.image", to: ".source"},
                        {from: ".model.text", to: ".caption"}
                    ]}
                ]}
            ]}
        ]},
        {name: "instantSearchResults", kind: "enyo.DataGridList", showing: false, components: [
            {kind: "moon.GridListImageItem", bindings: [
                {from: ".model.image", to: ".source"},
                {from: ".model.text", to: ".caption"}
            ]}
        ]}
    ],
    bindings: [
        {from: ".controller.title1", to: ".$.title1.content"},
        {from: ".controller.title2", to: ".$.title2.content"},
        {from: ".controller.title3", to: ".$.title3.content"},
        {from: ".controller.title4", to: ".$.title4.content"},
        {from: ".controller.title5", to: ".$.title5.content"},
        {from: ".controller.title6", to: ".$.title6.content"},
        {from: ".controller.recentSearchResults1", to: ".$.recentSearchResults1.controller"},
        {from: ".controller.recentSearchResults2", to: ".$.recentSearchResults2.controller"},
        {from: ".controller.recentSearchResults3", to: ".$.recentSearchResults3.controller"},
        {from: ".controller.recentSearchResults4", to: ".$.recentSearchResults4.controller"},
        {from: ".controller.recentSearchResults5", to: ".$.recentSearchResults5.controller"},
        {from: ".controller.recentSearchResults6", to: ".$.recentSearchResults6.controller"},
        {from: ".controller.instantSearchResults", to: ".$.instantSearchResults.controller"}
    ],

    //* @public
    onInputChanged: function(inSender, inEvent) {
        if(inEvent.originator.getValue() !== "") {
            this.$.recentResult.setShowing(false);
            this.$.instantSearchResults.setShowing(true);
        } else {
            this.$.recentResult.setShowing(true);
            this.$.instantSearchResults.setShowing(false);
        }
    }
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        title1: "RECENT SEARCH1",
        title2: "RECENT SEARCH2",
        title3: "RECENT SEARCH3",
        title4: "RECENT SEARCH4",
        title5: "RECENT SEARCH5",
        title6: "RECENT SEARCH6",
        recentSearchResults1: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        recentSearchResults2: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        recentSearchResults3: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        recentSearchResults4: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        recentSearchResults5: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        recentSearchResults6: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"}
        ]),
        instantSearchResults: new enyo.Collection([
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image: "../assets/default-movie.png"},
            {text: "RESULT", image:"../assets/default-movie.png"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.search.SearchFullSample",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "searchDrawerController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});