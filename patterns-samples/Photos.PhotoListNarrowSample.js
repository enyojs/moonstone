enyo.kind({
    name: "moon.sample.photos.PhotoListNarrowSample",
    kind : "moon.Panel",
    classes: "moon enyo-unselectable enyo-fit",
    classes : "photo-album",
    title : "ALBUM",
    titleAbove : "02",
    titleBelow : "97 Photos",
    components: [
        {kind : "enyo.Spotlight"},
        {
            kind : "FittableRows",
            fit : true,
            components : [
                {                   
                    kind : "moon.Scroller",
                    classes: "enyo-fill",
                    touch : true,
                    components : [
                        {
                            kind: "moon.ImageItem",
                            source: "./assets/default-movie.png",
                            label : "Description comes here",
                        },
                        {
                            kind: "moon.ImageItem",
                            source: "./assets/default-movie.png",
                            label : "Description comes here",
                        },
                        {
                            kind: "moon.ImageItem",
                            source: "./assets/default-movie.png",
                            label : "Description comes here",
                        },
                        {
                            kind: "moon.ImageItem",
                            source: "./assets/default-movie.png",
                            label : "Description comes here",
                        }
                    ]
                }
            ]
        }
    ]
});