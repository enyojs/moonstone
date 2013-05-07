enyo.kind({
    name: "moon.sample.music.ArtistDetailWideSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-artist-detail",
    fit: true,
    title: "Artist",
    titleAbove: "04",
    titleBelow: "Artist Name",
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
            fit: true,
            components: [
                {
                    name: "detail",
                    kind: "FittableRows",
                    classes: "detail",
                    components: [
                        {
                            name: "music",
                            classes: "preview",
                            components: [{name: "play", classes: "play-icon"}]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "info",
                            components: [
                                {classes: "title", content: "Organized"},
                                {classes: "content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "info",
                            components: [
                                {classes: "title", content: "Debut"},
                                {classes: "content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "info",
                            components: [
                                {classes: "title", content: "Type"},
                                {classes: "content", content: "Solo"}
                            ]
                        }
                    ]
                },
                {
                    classes: "bio",
                    kind: "FittableRows",
                    components: [
                        {kind: "moon.Divider", classes: "devider", content: "Bio"},
                        {
                            classes: "content",
                            content: "Jon Arryn, the Hand of the King, is dead. Ki" +
                                     "ng Robert Baratheon plans to ask his oldest " +
                                     "friend, Eddard Stark, to take Jon's place. A" +
                                     "cross the sea, Viserys Targaryen plans to we" +
                                     "d his sister to a nomadic warlord in exchang" +
                                     "e for an army. Jon Arryn, the Hand of the Ki" +
                                     "ng, is dead. King Robert Baratheon plans to " +
                                     "ask his oldest friend, Eddard Stark, to take" +
                                     " Jon's place. Across the sea, Viserys Targar" +
                                     "yen plans to wed his sister to a nomadic war" +
                                     "lord in exchange for an army. Jon Arryn, the" +
                                     " Hand of"
                        }
                    ]
                },
                {
                    classes: "related",
                    fit: true,
                    components: [
                        {
                            kind: "moon.Divider",
                            classes: "devider",
                            content: "Related Artists"
                        },
                        {
                            kind: "FittableColumns",
                            components: [
                    			{
                                    classes: "left-item",
                                    components: [
                                        {
                                            tag: "img",
                                            src: "assets/blank.png",
                                            classes: "focus"
                                        }
                                    ]
                                },
                    			{
                                    classes: "center-item",
                                    components: [
                                        {
                                            tag: "img",
                                            src: "assets/blank.png",
                                            classes: "focus"
                                        }
                                    ]
                                },
                                {
                                    classes: "right-item",
                                    components: [
                                        {
                                            tag: "img",
                                            src: "assets/blank.png",
                                            classes: "focus"
                                        }
                                    ]
                                }
                    		]
                        },
                        {
                            kind: "moon.Divider",
                            classes: "second-devider",
                            content: "Top 10 Tracks"
                        },
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
                                                {
                                                    name: "artist",
                                                    classes: "small-content"
                                                },
                                                {
                                                    name: "time",
                                                    classes: "small-content"
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
        this.$.music.setBounds({width: d, height: d});
        
        d = Math.round((d - 168) * 0.5);
        this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
        
        d = this.getAbsoluteBounds().height;
        d -= this.$.list.getAbsoluteBounds().top;
        this.$.list.setBounds({height: d});
    },
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.time.setContent("3:40");
	}
});
