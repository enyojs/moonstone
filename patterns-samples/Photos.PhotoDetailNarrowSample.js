enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    //kind: "FittableRows",
    kind : "moon.Panel",
    style: "background: #eaeaea;",
    classes: "moon enyo-unselectable",
    fit: true,

    handlers: {

    },

    create: function() {
        this.inherited(arguments);
        
        this.setHeader({
            title : "PHOTO NAME",
            index : "03",
            titleBelow : "2013-04-08"
        });
    },

    headerComponents : [
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-favorite.png", style : "margin : 0px 20px 10px 0px;" },
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-download.png", style : "margin : 0px 20px 10px 0px;"},
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-next.png", style : "margin : 0px 20px 10px 0px;" },
    ],

    components: [
        {kind : "enyo.Spotlight"},
        {
            //tag : "img",
            kind : "enyo.Image",
            src : "./assets/default-movie.png",
            style : "margin: 20px 0px 0px 0px;width:600px; height:400px;"
        }
    ]
});