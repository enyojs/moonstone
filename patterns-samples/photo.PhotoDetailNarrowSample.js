enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    kind: "FittableRows",
    style: "background: #eaeaea;",
    classes: "moon enyo-unselectable",
    fit: true,

    handlers: {

    },

    components: [
        {kind : "enyo.Spotlight"},
        { 
            kind : "moon.Header",
            title : "PHOTO NAME",
            titleAbove : "03",
            titleBelow : "2013-04-08",
            components : [
                { 
                    name : "iconContainer",
                    style : "text-align:right;padding : -10px 0px 0px 10px;",
                    components : [
                        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-favorite.png", style : "margin : 0px 20px 10px 0px;" },
                        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-download.png", style : "margin : 0px 20px 10px 0px;"},
                        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-next.png", style : "margin : 0px 20px 10px 0px;" },
                    ]
                }
            ]
        }, 
        {
            tag : "img",
            src : "./assets/default-movie.png",
            style : "margin: 20px 10px 0px 10px;width:600px; height:400px;"

        }
    ]
});