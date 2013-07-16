// Search.SearchDrawerSample
enyo.kind({
    //* @public
    name: "moon.sample.search.SearchDrawerSample",
    classes: "enyo-fit moon drawer-sample",
    fit: true,
    components: [
		{
            kind:"moon.Drawers",
            drawers:[
				{name:"searchDrawer", kind:"moon.Drawer",
					handle: {kind:"moon.DrawerHandle", content:"SEARCH"},
					components:[{name: "drawer", kind: "moon.sample.search.SearchDrawer"}]
				}
			],
            components: [
                {
                    kind: "moon.Panel",
                    classes: "enyo-fit",
                    //* @protected
                    title: "Empty",
                    style: "background-color: #EAEAEA;",
                    headerComponents: [
                        {kind: "moon.IconButton", style: "margin: 0px 0px 10px 15px;", src: "../assets/trash-can-icon.png"}
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.title1", to: "$.drawer.$.title1.content"},
        {from: ".controller.title2", to: "$.drawer.$.title2.content"},
        {from: ".controller.title3", to: "$.drawer.$.title3.content"},
        {from: ".controller.title4", to: "$.drawer.$.title4.content"},
        {from: ".controller.title5", to: "$.drawer.$.title5.content"},
        {from: ".controller.title6", to: "$.drawer.$.title6.content"},
        {from: ".controller.recentSearchResults1", to: "$.drawer.$.recentSearchResults1.controller"},
        {from: ".controller.recentSearchResults2", to: "$.drawer.$.recentSearchResults2.controller"},
        {from: ".controller.recentSearchResults3", to: "$.drawer.$.recentSearchResults3.controller"},
        {from: ".controller.recentSearchResults4", to: "$.drawer.$.recentSearchResults4.controller"},
        {from: ".controller.recentSearchResults5", to: "$.drawer.$.recentSearchResults5.controller"},
        {from: ".controller.recentSearchResults6", to: "$.drawer.$.recentSearchResults6.controller"},
        {from: ".controller.instantSearchResults", to: "$.drawer.$.instantSearchResults.controller"}
    ]
});


// Search.SearchDrawer
enyo.kind({
    //* @public
    name: "moon.sample.search.SearchDrawer",
    kind: "moon.InputPanel",
    handlers: {
        "onInputChanged": "onInputChanged"
    },
    //* @protected
    fit: true,
    title: "Search",
    spotlight: false,
    style: "background-color: #EAEAEA;",
    headerComponents: [
        {kind: "moon.IconButton", style: "margin: 0px 0px 10px 15px", src: "assets/trash-can-icon.png"}
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
                style: "height: 126px; width: 126px; margin: 10px;",
                spotlightPosition:"bottom"
            }
        ]}
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

// enyo.DataGridListImageItem

enyo.kind({
    name: "enyo.TitleImageItem",
    kind: "enyo.GridListImageItem",
    classes: "enyo-gridlist-titleimageitem",
    components:[
        {name: 'image', bindFrom: "image", bindTo: "src", kind: 'enyo.Image'},
        {name: "text", bindFrom: "text", classes: "caption"}
    ]
});

// moon.TitleImageItem

enyo.kind({
    name: "moon.TitleImageItem",
    kind: "enyo.TitleImageItem",
    spotlight: true,
    classes: "moon-gridlist-titleimageitem"
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
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.search.SearchDrawerSample",
                    controller: ".app.controllers.searchDrawerController",
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