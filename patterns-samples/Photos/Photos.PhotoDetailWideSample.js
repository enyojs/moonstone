enyo.kind({
    name: "moon.sample.photos.PhotoDetailWideSample",
    kind: "moon.Panel",
    classes: "moon enyo-unselectable",
    title: "PHOTO NAME",
    titleAbove: "03",
    titleBelow:  "2013-04-08",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    components: [
        {
            kind: "FittableColumns",
            fit: true,
            components: [
                {
                    fit: true,
                    components: [
                        {
                            kind: "enyo.Image",
                            classes: "enyo-fill",
                            src: "../assets/default-movie.png"
                        }
                    ]
                },
                {
                    kind: "FittableRows",
                    classes: "moon-15h",
                    components: [
                        {
                            kind: "moon.RadioItemGroup",
                            classes: "enyo-tool-decorator",
                            onActivate: "buttonActivated",
                            components: [
                                {name: "buttonDesc", content: "DESCRIPTION"},
                                {name: "buttonComments", content: "COMMENTS(98)"},
                                {name: "buttonLikes", content: "LIKES(387)"},
                                {name: "buttonAlbums", content: "ALBUMS(5)"}
                            ]
                        },
                        {kind: "moon.Divider", classes: "divider"},
                        {
                            name: "panels",
                            fit: true,
                            kind: "enyo.Panels",
                            components: [
                                {
                                    kind: "moon.Scroller",
                                    components: [
                                        {name: "description"}
                                    ]
                                },
                                {
                                    name: "contentsList",
                                    kind: "moon.DataList",
                                    components: [
                                        {
                                            kind: "moon.GridListImageItem",
                                            classes: "moon-3h moon-4v",
                                            style: "width:300px;float: left;",
                                            bindings: [
                                                {from: ".model.username", to: ".caption"},
                                                {from: ".model.date", to: ".subCaption"},
                                                {from: ".model.picUrl", to: ".source"}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: "likesList",
                                    kind: "moon.DataList",
                                    components: [
                                        {
                                            kind: "moon.GridListImageItem",
                                            classes: "moon-3h moon-4v",
                                            style: "width:300px;float: left;",
                                            bindings: [
                                                {from: ".model.username", to: ".caption"},
                                                {from: ".model.picUrl", to: ".source"}
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: "albumsList",
                                    kind: "moon.DataList",
                                    components: [
                                        {
                                            kind: "moon.GridListImageItem",
                                            classes: "moon-3h moon-4v",
                                            style: "width:300px;float: left;",
                                            bindings: [
                                                {from: ".model.albumname", to: ".caption"},
                                                {from: ".model.picUrl", to: ".source"}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.description", to: ".$.description.content"},
        {from: ".controller.contents", to: ".$.contentsList.controller"},
        {from: ".controller.likes", to: ".$.likesList.controller"},
        {from: ".controller.albums", to: ".$.albumsList.controller"}
    ],
    buttonActivated: function(inSender, inEvent) {
        if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioItem")) {
            var tName = inEvent.originator.name;

            if(tName == "buttonDesc"){
                this.$.panels.setIndex(0);
            } else if(tName=="buttonComments"){
                this.$.panels.setIndex(1);
            } else if(tName=="buttonLikes"){
                this.$.panels.setIndex(2);
            } else if(tName=="buttonAlbums"){
                this.$.panels.setIndex(3);
            }
        }
    },
    rendered: function() {
        this.inherited(arguments);
        enyo.Spotlight.spot(this.$.buttonDesc);
    }
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.",
        contents: new enyo.Collection([
            {picUrl: "http://placehold.it/300x250", username: "user name", date: "Aril, 8th, 2013", description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet."},
            {picUrl: "http://placehold.it/300x250", username: "user name", date: "Aril, 8th, 2013", description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet."},
            {picUrl: "http://placehold.it/300x250", username: "user name", date: "Aril, 8th, 2013", description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet."},
            {picUrl: "http://placehold.it/300x250", username: "user name", date: "Aril, 8th, 2013", description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet."},
            {picUrl: "http://placehold.it/300x250", username: "user name", date: "Aril, 8th, 2013", description: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet."}
        ]),
        likes: new enyo.Collection([
            {picUrl: "http://placehold.it/300x250", username: "user name"},
            {picUrl: "http://placehold.it/300x250", username: "user name"},
            {picUrl: "http://placehold.it/300x250", username: "user name"},
            {picUrl: "http://placehold.it/300x250", username: "user name"},
            {picUrl: "http://placehold.it/300x250", username: "user name"}
        ]),
        albums: new enyo.Collection([
            {picUrl: "http://placehold.it/300x250", albumname: "album name"},
            {picUrl: "http://placehold.it/300x250", albumname: "album name"},
            {picUrl: "http://placehold.it/300x250", albumname: "album name"},
            {picUrl: "http://placehold.it/300x250", albumname: "album name"},
            {picUrl: "http://placehold.it/300x250", albumname: "album name"}
        ])
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.photos.PhotoDetailWideSample",
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