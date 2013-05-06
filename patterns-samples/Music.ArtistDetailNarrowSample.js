enyo.kind({
    name: "moon.sample.music.ArtistDetailNarrowSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-artist-detail",
    fit: true,
    title: "Artist",
    titleAbove: "04",
    headerComponents: [
        {
            classes: "header",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-like.png"},
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-next.png",
                    classes: "right-button"
                }
            ]
        }
    ],
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "FittableColumns",
            classes: "client",
            components: [
                {
                    name: "music",
                    classes: "preview",
                    components: [{name: "play", classes: "play-icon"}]
                },
                {
                    kind: "FittableRows",
                    fit: true,
                    components: [
                        {classes: "heading", content: "Artist Name"},
                        {
                            kind: "FittableColumns",
                            components: [
                                {classes: "title", content: "Organized"},
                                {classes: "content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            components: [
                                {classes: "title", content: "Debut"},
                                {classes: "content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            components: [
                                {classes: "title", content: "Type"},
                                {classes: "content", content: "Solo"}
                            ]
                        }
                    ]
                }
            ]
        },
        {kind: "moon.Divider", classes: "devider", content: "Top 10 Tracks"},
        {
            name: "listContainer",
            spotlight: "container",
            components: [
                {
                    name: "list",
                    kind: "moon.List",
                    style: "height: 300px;",
                    count: 10,
                    multiSelect: false,
                    onSetupItem: "setupItem",
                    components: [
                        {
                            kind: "enyo.FittableColumns",
                            classes: "item",
                            fit: true,
                            components: [
                                {
                                    name: "preview",
                                    fit: true,
                                    classes: "preview",
                                    components: [{classes: "play-icon"}]
                                },
                                {style: "display: table-cell; width: 20px;"},
                                {
                                    classes: "heading",
                                    components: [
                                        {name: "track"},
                                        {name: "time", classes: "small-content"}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    
    rendered: function() {
        this.inherited(arguments);
        this.resizeHandler();
    },
    
    resizeHandler: function() {
        var d = Math.round(this.getBounds().width * 0.3);
        if (d < 180) {
            d = 180;
        } else if (d > 388) {
            d = 388;
        }
        this.$.music.setBounds({width: d, height: d});
        
        d = Math.round((d - 168) * 0.5);
        this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
        
        d = this.getAbsoluteBounds().height;
        d -= this.$.listContainer.getAbsoluteBounds().top;
        this.$.list.setBounds({height: d});
    },
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.time.setContent("3:40");
	}
});
