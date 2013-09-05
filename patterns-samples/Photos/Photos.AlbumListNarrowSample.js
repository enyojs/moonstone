// Sample view

enyo.kind({
    name: "moon.sample.photos.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    published: {
        option: {
            source: "",
            title: ""
        }
    },
    components:[
        {
            kind: "FittableColumns",
            components: [
                {
                    components: [
                        {name: "image", kind: "enyo.Image"}
                    ]
                },
                {name: "title", kind: "enyo.Control", classes: "title-text", style: "margin-left: 20px"}
            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
        this.optionChanged();
    },
    optionChanged: function() {
        if (!this.option.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.option.source);
        this.$.title.content = this.option.title;
    }
});

enyo.kind({
    name: "moon.sample.photos.AlbumListNarrowSample",
    kind: "moon.Panel",
    titleAbove: "01",
    title: "ALBUMS",
    titleBelow: "",
    components: [
        {
            name: "menuList",
            kind: "moon.DataList",
            components: [
                {
                    kind: "moon.sample.photos.AlbumListItem",
                    bindings: [
						{from: ".model.option", to: ".option"}
					]
				}
            ]
        }
    ],

    bindings: [
        {from: ".controller.menus", to: ".$.menuList.controller"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        menus: new enyo.Collection([
            {option: {source: "../assets/default-movie.png", title: "Album Name"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name"}},
            {option: {source: "../assets/default-movie.png", title: "Album Name"}}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.photos.AlbumListNarrowSample",
                    controller: ".app.controllers.photoController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "photoController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});