enyo.kind({
    name: "moon.sample.video.BrowserMoviesNarrowSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-video-browsermovies",
    titleAbove: "02",
    title: "Browser Movies",
    titleBelow: "37 Movies",

    headerComponents: [
        {classes: "moon-video-browsermovie-header-button", components: [
            {kind: "moon.IconButton", src: "../assets/icon-list.png"}
        ]}
    ],

    components: [
        {kind: "enyo.Spotlight"},
        {
            kind : "moon.Scroller",
            fit: true,
            touch : true,
            horizontal : "hidden",
            components : [
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: "../assets/album.png",
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                }
            ]
        }
    ]
});