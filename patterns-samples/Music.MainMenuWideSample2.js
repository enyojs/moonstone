enyo.kind({
    name: "moon.sample.music.MainMenuWideSample2",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-music-mainmenu",
    fit: true,
    index: "01",
    title: "Main Menu",
    
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "columns",
            kind: "FittableColumns",
            fit: true,
            components: [
                {
                    classes: "moon-music-mainmenu-menu",
                    components: [
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Video", spotlight: true},
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Photos", spotlight: true},
                        {kind: "moon.Item", classes: "moon-music-mainmenu-item", content: "Browser Music", spotlight: true}
                    ]
                },
                {
                    fit: true,
                    /**
                        place any control instead of followings.
                    */
                    classes: "moon-music-mainmenu-content",
                    content: "branding"
                }
            ]
        }
    ],  
});