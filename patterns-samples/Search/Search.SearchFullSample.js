// enyo.TitleImageItem

enyo.kind({
    name: "enyo.TitleImageItem",
    kind: "enyo.GridListImageItem",
    classes: "enyo-gridlist-titleimageitem",
    components:[
        {
            bindings: [
                {from: ".model.image", to: ".$.image.src"},
                {from: ".model.text", to: ".$.text.caption"}
            ],
            components: [
                {name: "image", kind: "enyo.Image"},
                {name: "text"}
            ]
        }
    ]
});

// moon.TitleImageItem

enyo.kind({
    name: "moon.TitleImageItem",
    kind: "enyo.TitleImageItem",
    spotlight: true,
    classes: "moon-gridlist-titleimageitem"
});

// Search.SearchFullSample

enyo.kind({
    //* @public
    name: "moon.sample.search.SearchFullSample",
    kind: "moon.Panel",
    headerOption: {kind:"moon.InputHeader"},
    handlers: {
        "onInputChanged": "onInputChanged"
    },
    //* @protected
    fit: true,
    title: "Search",
    spotlight: false,
    style: "background-color: #EAEAEA;",
    headerComponents: [
        {kind: "moon.IconButton", style: "margin: 0px 0px 10px 15px", src: ".../assets/trash-can-icon.png"}
    ],
    components: [
        {name: "recentResult", kind: "moon.Scroller", fit: true, components: [
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title1", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults1", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title2", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults2", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title3", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults3", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title4", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults4", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title5", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults5", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]},
            {style: "display: inline-block; float: left; width: 438px;", components: [
                {name: "title6", kind: "moon.Item"},
                {components: [
                    {name: "recentSearchResults6", kind: "enyo.DataGridList", components: [
                        {kind: "moon.TitleImageItem", style: "height: 126px; width: 126px; margin: 10px;"}
                    ]}
                ]}
            ]}
        ]},
        {name: "instantSearchResults", kind: "enyo.DataGridList", showing: false, components: [
            {
                kind: "moon.TitleImageItem",
                style: "height: 126px; width: 126px; margin: 10px;"
            }
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
        if(inEvent.keyword !== "") {
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
                    controller: ".app.controllers.searchFullController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "searchFullController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});
