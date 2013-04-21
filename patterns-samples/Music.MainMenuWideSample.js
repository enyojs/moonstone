enyo.kind({
    name: "moon.sample.music.MainMenuWide",
    layoutKind: "enyo.FittableRowsLayout",
    classes: "enyo-unselectable moon moon-music-mainmenu",
    fit: true,
    title: "Main Menu",
    titleAbove: "01",
    components: [
        {kind: "enyo.Spotlight"},
        {kind: "moon.Header", content: "Main Menu", titleAbove: "01"},
        {
            name: "columns",
            kind: "FittableColumns",
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
                    name: "content",
                    fit: true,
                    classes: "moon-music-mainmenu-content",
                    components: [
                        {
                            name: "branding",
                            fit: true,
                            classes: "moon-music-mainmenu-branding",
                            content: "branding"
                        }
                    ]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeBranding();
    },
    
    resizeBranding: function() {
        var w = this.$.content.getBounds().width;
        var h = this.getBounds().height - this.$.columns.getBounds().top - 2;
        this.$.branding.setBounds({width: w, height: h});
    }
});
