enyo.kind({
    name: "moon.sample.video.MainMenuNarrowSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-video-mainmenu",
    titleAbove: "01",
    title: "Main Menu",
    components: [
/** If you want to use this template alone with spotlight, remove this comment out.
        {kind: "enyo.Spotlight"},
*/        
        {
            classes: "moon-video-mainmenu-menu",
            components: [
                {kind: "moon.Item", content: "Browser Movies"},
                {kind: "moon.Item", content: "Browser TV Shows"},
                {kind: "moon.Item", content: "Queue"},
                {kind: "moon.Item", content: "Search"}
            ]
        }
    ]
 });
