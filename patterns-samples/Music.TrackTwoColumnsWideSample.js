enyo.kind({
    name: "moon.sample.music.TrackTwoColumnsWideSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-track-two-column",
    fit: true,
    title: "Browser Tracks",
    titleAbove: "02",
    titleBelow: "15 Tracks",
    headerComponents: [
        {
            classes: "header",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-album.png"},
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-list.png",
                    classes: "right-button"
                }
            ]
        }
    ],
    count: 15,
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "list",
            kind: "moon.List",
            style: "height: 300px;",
            classes: "list",
            count: 8,
            multiSelect: false,
            onSetupItem: "setupItem",
            components: [
                {
                    name: "item",
                    kind: "enyo.FittableColumns",
                    classes: "item",
                    fit: true,
                    components: [
                        {
                            kind: "enyo.FittableColumns",
                            classes: "column",
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
                                    classes: "label",
                                    components: [
                                        {name: "track", classes: "content"},
                                        {name: "artist", classes: "small-content"}
                                    ]
                                },
                                {name: "time", classes: "time"}
                            ]
                        },
                        {
                            kind: "enyo.FittableColumns",
                            classes: "column",
                            fit: true,
                            components: [
                                {
                                    name: "preview2",
                                    fit: true,
                                    classes: "preview",
                                    components: [{classes: "play-icon"}]
                                },
                                {style: "display: table-cell; width: 20px;"},
                                {
                                    classes: "label",
                                    components: [
                                        {name: "track2", classes: "content"},
                                        {name: "artist2", classes: "small-content"}
                                    ]
                                },
                                {name: "time2", classes: "time"}
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
        var h = this.getAbsoluteBounds().height;
        h -= this.$.list.getAbsoluteBounds().top;
        this.$.list.setBounds({height: h});
    },
    
    setupItem: function(inSender, inEvent) {
        var index = inEvent.index * 2;
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist");
		this.$.time.setContent("3:40");
        
        index++;
        if (index < this.count) {
            this.$.preview2.setShowing(true);
            this.$.preview2.setStyle("background-image: url(" + url + ");");
    		this.$.track2.setContent("Track Name");
    		this.$.artist2.setContent("Artist");
    		this.$.time2.setContent("3:40");
        } else {
            this.$.preview2.setShowing(false);
    		this.$.track2.setContent("");
    		this.$.artist2.setContent("");
    		this.$.time2.setContent("");
        }
	}
});
