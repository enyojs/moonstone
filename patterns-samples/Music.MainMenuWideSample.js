enyo.kind({
    name: "moon.sample.music.MainMenuWideSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-music-main-menu",
    fit: true,
    spotlight: false,
    title: "Main Menu",
    titleAbove: "01",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "columns",
            kind: "FittableColumns",
            components: [
                {
                    classes: "menu",
                    components: [
                        {kind: "moon.Item", content: "Browser Tracks"},
                        {kind: "moon.Item", content: "Browser Albums"},
                        {kind: "moon.Item", content: "Browser Artists"},
                        {kind: "moon.Item", content: "Browser Playlist"},
                    ]
                },
                {
                    name: "content",
                    fit: true,
                    classes: "content",
                    components: [
                        {
                            name: "branding",
                            fit: true,
                            classes: "branding",
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
        var h = this.getBounds().height;
        h -= this.$.columns.getAbsoluteBounds().top - 2;
        this.$.branding.setBounds({width: w, height: h});
    }
});
