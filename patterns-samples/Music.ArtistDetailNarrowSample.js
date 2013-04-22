enyo.kind({
    name: "moon.sample.music.ArtistDetailNarrowSample",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-music-detail",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            content: "Artist",
            titleAbove: "04",
            titleBelow: "Artist Name",
            components: [
                {
                    classes: "moon-music-detail-header-button",
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-like.png"},
                        {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
                    ]
                }
            ]
        },
        {
            name: "container",
            kind: "FittableColumns",
            classes: "moon-music-detail-container",
            fit: true,
            components: [
                {
                    name: "detail",
                    kind: "FittableRows",
                    classes: "moon-music-detail-detail",
                    components: [
                        {
                            kind: "FittableColumns",
                            components: [
                                {
                                    name: "movie",
                                    classes: "moon-music-detail-preview",
                                    components: [{name: "play", classes: "moon-play-icon"}]
                                },
                                {
                                    kind: "FittableRows",
                                    fit: true,
                                    components: [
                                        {classes: "moon-music-item-label", content: "Artist Name"},
                                        {
                                            kind: "FittableColumns",
                                            components: [
                                                {classes: "moon-music-artist", content: "Organized"},
                                                {classes: "moon-music-artist-content", content: "5 April 2013"}
                                            ]
                                        },
                                        {
                                            kind: "FittableColumns",
                                            components: [
                                                {classes: "moon-music-artist", content: "Debut"},
                                                {classes: "moon-music-artist-content", content: "5 April 2013"}
                                            ]
                                        },
                                        {
                                            kind: "FittableColumns",
                                            components: [
                                                {classes: "moon-music-artist", content: "Type"},
                                                {classes: "moon-music-artist-content", content: "Solo"}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {kind: "moon.Divider", classes: "moon-music-detail-top-devider", content: "Top 10 Tracks"},
                        {
                            name: "listContainer",
                            fit: true,
                            spotlight: "container",
                            components: [
                                {
                                    name: "list",
                                    kind: "moon.List",
                                    classes: "enyo-fit",
                                    orient: "v",
                                    count: 10,
                                    multiSelect: false,
                            		onSetupItem: "setupItem",
                                    components: [
                            			{
                                            name: "item",
                                            kind: "enyo.FittableColumns",
                                            classes: "moon-music-item",
                                            fit: true,
                                            components: [
                                                {
                                                    name: "image",
                                                    fit: true,
                                                    classes: "moon-music-item-image",
                                                    components: [{classes: "moon-play-music-icon"}]
                                                },
                                                {style: "display: table-cell; width: 20px;"},
                                                {
                                                    classes: "moon-music-item-label",
                                                    components: [
                                                        {name: "track"},
                                                        {name: "time", classes: "moon-music-item-label-small"}
                                                    ]
                                                }
                                            ]
                                        }
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
        var d = Math.round(this.$.detail.getBounds().width * 0.3);
        if (d < 180) {
            d = 180;
        }
        this.$.movie.setBounds({width: d, height: d});
        
        d = Math.round((d - 168) * 0.5);
        this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
        
        var rect = this.$.listContainer.getBounds();
        this.$.list.setBounds({top: rect.top, left: rect.left});
    },
    
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.image.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.time.setContent("3:40");
	}
});
