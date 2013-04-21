enyo.kind({
    name: "moon.VideoMainMenuWideSample",
    layoutKind: "enyo.FittableRowsLayout",
    classes: "enyo-unselectable moon moon-video-mainmenu",
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
                    classes: "moon-video-mainmenu-menu",
                    components: [
                        {kind: "moon.Item", content: "Browser Movies", spotlight: true},
                        {kind: "moon.Item", content: "Browser TV Shows", spotlight: true},
                        {kind: "moon.Item", content: "Queue", spotlight: true},
                        {kind: "moon.Item", content: "Search", spotlight: true}
                    ]
                },
                {
                    name: "content",
                    fit: true,
                    classes: "moon-video-mainmenu-content",
                    components: [
                        {
                            name: "branding",
                            fit: true,
                            classes: "moon-video-mainmenu-branding",
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
