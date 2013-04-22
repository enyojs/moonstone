enyo.kind({
    name: "moon.sample.music.MainMenuWideSample",
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
                        {kind: "moon.Item", content: "Browser Tracks", spotlight: true},
                        {kind: "moon.Item", content: "Browser Albums", spotlight: true},
                        {kind: "moon.Item", content: "Browser Artists", spotlight: true},
                        {kind: "moon.Item", content: "Browser Playlist", spotlight: true},
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
