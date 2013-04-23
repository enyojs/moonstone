enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    kind : "moon.Panel",
    classes: "moon enyo-unselectable",
    fit: true,
    title : "PHOTO NAME",
    titleAbove : "03",
    titleBelow : "2013-04-08",

    create: function() {
        this.inherited(arguments);
    },

    headerComponents : [
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-favorite.png", style : "margin : 0px 20px 10px 0px;" },
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-download.png", style : "margin : 0px 20px 10px 0px;"},
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-next.png", style : "margin : 0px 20px 10px 0px;" },
    ],

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "enyo.Image",
            src : "./assets/default-movie.png",
            style : "margin: 20px 0px 0px 0px;width:600px; height:400px;"
        }
    ]
});