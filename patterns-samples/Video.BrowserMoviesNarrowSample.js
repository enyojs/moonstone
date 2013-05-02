enyo.kind({
    name: "moon.sample.video.BrowserMoviesNarrowSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-video-browsermovies",
    titleAbove: "02",
    title: "Browser Movies",
    titleBelow: "37 Movies",

    headerComponents: [
        {classes: "moon-video-browsermovie-header-button", components: [
            {kind: "moon.IconButton", src: "$lib/moonraker/patterns-samples/assets/icon-list.png"}
        ]}
    ],    
    
    components: [
/** If you want to use this template alone with spotlight, remove this comment out.
        {kind: "enyo.Spotlight"},
*/        
        {
            kind : "moon.Scroller",                    
            fit: true,
            touch : true,
            horizontal : "hidden",
            components : [
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                },
                {
                    kind : "moon.ImageItem",
                    source: enyo.path.rewrite("$lib/moonraker/patterns-samples/assets/album.png"),
                    label: "MOVIE NAME",
                    text: "Staring: Actor Name and Actor Name"
                }
            ]
        }
    ]
});