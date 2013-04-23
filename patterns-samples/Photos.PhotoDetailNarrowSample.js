enyo.kind({
    name: "moon.sample.photos.PhotoDetailNarrowSample",
    kind : "moon.Panel",
    classes: "photo-detail",
    fit: true,
    title : "PHOTO NAME",
    titleAbove : "03",
    titleBelow : "2013-04-08",
    
    headerComponents : [
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-favorite.png"},
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-download.png"},
        { kind : "moon.IconButton", style : "border:none;", src : "assets/icon-next.png"},
    ],

    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "enyo.Image",
            src : "./assets/default-movie.png",
            style : "width:600px;height:400px;"
        }
    ]
});