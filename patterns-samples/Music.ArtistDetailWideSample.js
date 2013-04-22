enyo.kind({
    name: "moon.sample.music.ArtistDetailWideSample",
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
                            name: "movie",
                            classes: "moon-music-detail-preview",
                            components: [{name: "play", classes: "moon-play-icon"}]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "moon-music-detail-info",
                            components: [
                                {classes: "moon-music-detail-title", content: "Organized"},
                                {classes: "moon-music-detail-content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "moon-music-detail-info",
                            components: [
                                {classes: "moon-music-detail-title", content: "Debut"},
                                {classes: "moon-music-detail-content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "moon-music-detail-info",
                            components: [
                                {classes: "moon-music-detail-title", content: "Type"},
                                {classes: "moon-music-detail-content", content: "Solo"}
                            ]
                        }
                    ]
                },
                {
                    name: "synopsis",
                    classes: "moon-music-detail-bio",
                    components: [
                        {
                            kind: "FittableRows",
                            components: [
                                {kind: "moon.Divider", classes: "moon-music-detail-bio-devider", content: "Bio"},
                                {
                                    classes: "moon-music-detail-bio-content",
                                    components: [
                                        {
                                            content: "Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of the King, is dead. King Robert Baratheon plans to ask his oldest friend, Eddard Stark, to take Jon's place. Across the sea, Viserys Targaryen plans to wed his sister to a nomadic warlord in exchange for an army. Jon Arryn, the Hand of"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "more",
                    fit: true,
                    components: [
                        {kind: "moon.Divider", classes: "moon-music-detail-related-devider", content: "Related Artists"},
                        {
                            kind: "FittableColumns",
                            components: [
                    			{
                                    style: "width: 33%;",
                                    components: [
                                        {
                                            classes: "moon-music-detail-related-image",
                                            style: "background-image: url(assets/default-music.png); background-position: left center; text-align: left;",
                                            components: [{tag: "img", src: "assets/blank.png", classes: "related-focus"}]
                                        }
                                    ]
                                },
                    			{
                                    style: "width: 34%;",
                                    components: [
                                        {
                                            classes: "moon-music-detail-related-image",
                                            style: "background-image: url(assets/default-music.png); background-position: center; text-align: center;",
                                            components: [{tag: "img", src: "assets/blank.png", classes: "related-focus"}]
                                        }
                                    ]
                                },
                                {
                                    style: "width: 33%;",
                                    components: [
                                        {
                                            classes: "moon-music-detail-related-image",
                                            style: "background-image: url(assets/default-music.png); background-position: right center; text-align: right;",
                                            components: [{tag: "img", src: "assets/blank.png", classes: "related-focus"}]
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
                                                        {name: "artist", classes: "moon-music-item-label-small"},
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
        var d = this.$.detail.getBounds().width;
        this.$.movie.setBounds({width: d, height: d});
        
        d = Math.round((d - 160) * 0.5);
        this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
        
        var rect = this.$.listContainer.getBounds();
        this.$.list.setBounds({top: rect.top, left: rect.left});
        
        console.log(rect);
    },
    
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.image.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.time.setContent("3:40");
	}
});
