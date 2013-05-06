enyo.kind({
    name: "moon.sample.music.MainMenuWideSample2",
    kind: "moon.Panel",
    fit: true,
    title: "Main Menu",
    titleAbove: "01",
    classes: "enyo-unselectable moon moon-music-main-menu",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "columns",
            kind: "FittableColumns",
            components: [
                {
                    classes: "menu",
                    components: [
                        {kind: "moon.Item", classes: "item", content: "Browser Video"},
                        {kind: "moon.Item", classes: "item", content: "Browser Photos"},
                        {kind: "moon.Item", classes: "item", content: "Browser Music"}
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
