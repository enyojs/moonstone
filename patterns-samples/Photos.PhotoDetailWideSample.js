enyo.kind({
    name: "moon.sample.photos.PhotoDetailWideSample",
    kind : "moon.Panel",
    classes: "moon enyo-unselectable",
    fit: true,
    title : "PHOTO NAME",
    titleAbove : "03",
    titleBelow : "2013-04-08",

    create: function() {
        this.inherited(arguments);
<<<<<<< HEAD
        /*
        this.setHeader({
            title : "PHOTO NAME",
            index : "03",
            titleBelow : "2013-04-08"
        });*/
=======
>>>>>>> change header setting method
    },

    headerComponents : [
        { kind : "moon.IconButton", src : "assets/icon-favorite.png", style : "margin : 0px 20px 10px 0px;" },
        { kind : "moon.IconButton", src : "assets/icon-download.png", style : "margin : 0px 20px 10px 0px;"},
        { kind : "moon.IconButton", src : "assets/icon-next.png", style : "margin : 0px 20px 10px 0px;" },
    ],

    buttonActivated: function(inSender, inEvent) {
        if ((inEvent.originator.getActive()) && (inEvent.originator.kind === "moon.RadioButton")) {
            var tName = inEvent.originator.name;

            if(tName == "button-desc"){
                this.$.panels.setIndex(0);
            } else if(tName=="button-comments"){
                this.$.panels.setIndex(1);
            } else if(tName=="button-likes"){
                this.$.panels.setIndex(2);
            } else if(tName=="button-albums"){
                this.$.panels.setIndex(3);
            }        
        }
    },

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableColumns",
            style : "margin-top : 10px;",
            fit : true,
            components : [
                {
                    style : "width : 50%;",
                    components : [
                        {
                            kind : "enyo.Image", 
                            src : "assets/default-movie.png",
                            style : "padding:10px 10px 10px 10px; width:100%; margin : 5px 10px 0px 10px;"
                        }
                    ]
                },
                {
                   style : "width : 3%;"
                },
                {
                    kind : "FittableRows",
                    style : "width : 47%;",
                    components : [
                        {
                            components : [
                                {   
                                    components : [
                                        {   
                                            kind: "moon.RadioButtonGroup", 
                                            onActivate: "buttonActivated", 
                                            components: [
                                                {name : "button-desc", style: "width:130px; font-size: 22px; margin-right : 8px;", content: "DESCRIPTION"},
                                                {name : "button-comments", style: "width:150px; font-size: 22px; margin-right : 8px;", content: "COMMENTS(98)"},
                                                {name : "button-likes", style: "width:130px; font-size: 22px; margin-right : 8px;", content: "LIKES(387)"},
                                                {name : "button-albums", style: "width:120px; font-size: 22px; margin-right : 8px;", content: "ALBUMS(5)"},
                                                /*{name : "button-desc", content: "DESCRIPTION"},
                                                {name : "button-comments", content: "COMMENTS(98)"},
                                                {name : "button-likes", content: "LIKES(387)"},
                                                {name : "button-albums", content: "ALBUMS(5)"},*/
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        { kind : "moon.Divider", style : "width:100%,height:3px;margin :-20px 0px 5px 0px;"},
                        { 
                            name : "mainContent",
                            components : [  
                                {
                                    name : "panels",
                                    arrangerKind: "CardArranger", 
                                    index:0, 
                                    kind: "Panels", 
                                    fit:true, 
                                    realtimeFit: true, 
                                    classes: "panels-sample-panels", 
                                    components: [
                                        { 
                                            kind : "moon.sample.photos.PhotoDetailWideSample.description",
                                        },
                                        { 
                                            kind : "moon.sample.photos.PhotoDetailWideSample.comments",
                                        },
                                        { 
                                            kind : "moon.sample.photos.PhotoDetailWideSample.likes",
                                        },
                                        {
                                            kind : "moon.sample.photos.PhotoDetailWideSample.albums",
                                        },  
                                    ]
                                }
                            ]
                        }
                    ]                   
                }
            ]
        }
    ]
});

// description page
enyo.kind({
    name : "moon.sample.photos.PhotoDetailWideSample.description",
    kind : "moon.Scroller",
    components : [
        {
            style: "text-transform:none;white-space:normal;font-align:left; font-size:32px; line-height:36px; padding : 0px 10px 0px 10px;",
            content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom.",     
        }
    ]
});

// comments page
enyo.kind({
    name : "moon.sample.photos.PhotoDetailWideSample.comments",
    kind : "moon.Scroller",
    horizontal : "hidden",
    touch : true,
    components : [
        {
            kind: "sample.photo.FeedListItem",
            source: "./assets/man1.png",
            title : "Username &nbsp;&nbsp;&nbsp;<font color=gray>Apr 8th 2080</font>",
            text: "Add your name right now to keep fighting - for Newtown and countless other communities torn apart by gun violence. We may be momentarily knocked off our feet, but we will pick ourselves up.",
        },
        {
            kind: "sample.photo.FeedListItem",
            source: "./assets/man1.png",
            title : "Username &nbsp;&nbsp;&nbsp;<font color=gray>Apr 8th 2080</font>",
            text: "Add your name right now to keep fighting - for Newtown and countless other communities torn apart by gun violence. We may be momentarily knocked off our feet, but we will pick ourselves up.",
        },
        {
            kind: "sample.photo.FeedListItem",
            source: "./assets/man1.png",
            title : "Username &nbsp;&nbsp;&nbsp;<font color=gray>Apr 8th 2080</font>",
            text: "Add your name right now to keep fighting - for Newtown and countless other communities torn apart by gun violence. We may be momentarily knocked off our feet, but we will pick ourselves up.",
        },
        {
            kind: "sample.photo.FeedListItem",
            source: "./assets/man1.png",
            title : "Username &nbsp;&nbsp;&nbsp;<font color=gray>Apr 8th 2080</font>",
            text: "Add your name right now to keep fighting - for Newtown and countless other communities torn apart by gun violence. We may be momentarily knocked off our feet, but we will pick ourselves up.",
        },
    ]
});

// likes page
enyo.kind({
    name : "moon.sample.photos.PhotoDetailWideSample.likes",
    kind : "moon.Scroller",
    horizontal : "hidden",
    touch : true,
    components : [
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px",
            source: "./assets/man0.png",
            title : "Username",
        },
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px;",
            source: "./assets/man0.png",
            title : "Username",
        },
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px;",
            source: "./assets/man0.png",
            title : "Username",
        },
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px;",
            source: "./assets/man0.png",
            title : "Username",
        },
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px;",
            source: "./assets/man0.png",
            title : "Username",
        },
        {
            kind: "sample.photo.FeedListItem",
            style : "height:70px;",
            source: "./assets/man0.png",
            title : "Username",
        },
    ]
});

// albums page
enyo.kind({
    name : "moon.sample.photos.PhotoDetailWideSample.albums",
    kind : "moon.Scroller",
    horizontal : "hidden",
    touch : true,
    components : [
        { tag : "br" },
        {
            kind : "sample.photo.AlbumListItem",
            source: "./assets/default-movie.png",
            bgSource : "./assets/bg-movie.png",
            title : "ALBUM NAME",
        },
        {
            kind : "sample.photo.AlbumListItem",
            source: "./assets/default-movie.png",
            bgSource : "./assets/bg-movie.png",
            title : "ALBUM NAME",
        },
        {
            kind : "sample.photo.AlbumListItem",
            source: "./assets/default-movie.png",
            bgSource : "./assets/bg-movie.png",
            title : "ALBUM NAME",
        },
        {
            kind : "sample.photo.AlbumListItem",
            source: "./assets/default-movie.png",
            bgSource : "./assets/bg-movie.png",
            title : "ALBUM NAME",
        },
        {
            kind : "sample.photo.AlbumListItem",
            source: "./assets/default-movie.png",
            bgSource : "./assets/bg-movie.png",
            title : "ALBUM NAME",
        }
    ]
});

// FeedListItem
enyo.kind({
    name: "sample.photo.FeedListItem",
    classes: "sample-feed-list",
    kind: "moon.Item",
    components:[
        {
            kind : "FittableColumns",
            components : [
                {name: 'image', kind: 'enyo.Image', style : "width:70px;height:70px;"},
                {
                    style : "width:480px;margin-left:10px;",
                    components : [
                        { name:"feedTitle", allowHtml : true, style : "font-size:30px;"},
                        { name:"feedText", style : "margin-top:5px;font-size:22px;"}
                    ]
                }
            ]
        }
    ],

    published: {
        source: '',
        title: '',
        text: '',
    },

    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
        this.textChanged();
    },

    sourceChanged: function() {
        if (!this.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.source);
    },

    textChanged: function() {
        this.$.feedTitle.content = this.title;
        this.$.feedText.content = this.text;
    },
});

// AlbumListItem
enyo.kind({
    name: "sample.photo.AlbumListItem",
    classes: "sample-album-list-item",
    kind: "moon.Item",
    style : "margin : 0px 0px 80px 0px;",
    components:[
        {
            kind : "FittableColumns",
            components : [
                {
                    style : "margin : 40px 0px 60px 0px;",
                    components : [
                        {
                            name : "bgImage",
                            kind : "enyo.Image",
                            style : "margin: -22px 0px 0px 25px;",
                            components : [
                                {
                                    name : "image",
                                    kind : "enyo.Image",
                                    style : "margin: -216px 0px 0px 0px;",
                                }
                            ]
                        },
                    ]
                },
                {
                    name : "title",
                    style : "margin-left : 10px",
                }
            ]
        }
    ],

    published: {
        source: '',
        bgSource : '',
        title : '',
    },

    create: function() {
        this.inherited(arguments);
        this.sourceChanged();
        this.textChanged();
    },

    sourceChanged: function() {
        if (!this.source || this.source === '') {
            return;
        }
        this.$.image.setAttribute('src', this.source);
        this.$.bgImage.setAttribute('src', this.bgSource);
    },

    textChanged : function(){
        if (!this.title || this.title === '') {
            return;
        }
        this.$.title.content = this.title;
    }
});