enyo.kind({
    name: "moon.sample.video.MainMenuNarrowSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-video-mainmenu",
    fit: true,
    titleAbove: "01",
    title: "Main Menu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            classes: "moon-video-mainmenu-menu",
            components: [
                {kind: "moon.Item", content: "Browser Movies", spotlight: true},
                {kind: "moon.Item", content: "Browser TV Shows", spotlight: true},
                {kind: "moon.Item", content: "Queue", spotlight: true},
                {kind: "moon.Item", content: "Search", spotlight: true}
            ]
        }
    ]
 });
