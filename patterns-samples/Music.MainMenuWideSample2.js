enyo.kind({
    name: "moon.sample.music.MainMenuWideSample2",
    kind: "moon.Panel",
    fit: true,
    title: "Main Menu",
    titleAbove: "01",
    classes: "enyo-unselectable moon moon-music-mainmenu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "columns",
            kind: "FittableColumns",
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
