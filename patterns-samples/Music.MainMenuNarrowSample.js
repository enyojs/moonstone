enyo.kind({
    name: "moon.sample.music.MainMenuNarrowSample",
    kind: "moon.Panel",
    fit: true,
    index: "01",
    title: "Main Menu",    
    classes: "enyo-unselectable moon moon-music-mainmenu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "FittableColumns",
            components: [
                {
                    classes: "moon-music-mainmenu-menu",
                    components: [
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Video", spotlight: true},
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Photos", spotlight: true},
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Music", spotlight: true}
                    ]
                }
            ]
        }
    ]
});
