enyo.kind({
    name: "moon.MusicTrackTwoColumnsWideSample",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-music-trackonecolumn",
    fit: true,
    title: "Browser Tracks",
    titleAbove: "02",
    count: 15,
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            content: "Browser Tracks",
            titleAbove: "02",
            titleBelow: "5 Tracks",
            components: [
                {
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-album.png", classes: "moon-music-header-button"},
                        {kind: "moon.IconButton", src: "assets/icon-list.png", classes: "moon-music-header-button-right"}
                    ]
                }
            ]
        },
        {
            name: "container",
            classes: "moon-music-container",
            fit: true,
            spotlight: "container",
            components: [
                {
                    name: "list",
                    kind: "moon.List",
                    classes: "enyo-fit moon-music-list",
                    orient:"v",
                    count: 8,
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
                                    kind: "enyo.FittableColumns",
                                    classes: "moon-music-item-column",
                                    fit: true,
                                    components: [
                                        {
                                            name: "image",
                                            fit: true,
                                            classes: "moon-music-item-image",
                                            components: [{classes: "moon-play-icon"}]
                                        },
                                        {style: "display: table-cell; width: 20px;"},
                                        {
                                            classes: "moon-music-item-label",
                                            components: [
                                                {name: "track", classes: "moon-music-item-track"},
                                                {name: "artist", classes: "moon-music-item-artist"}
                                            ]
                                        },
                                        {name: "time", classes: "moon-music-item-label-right"}
                                    ]
                                },
                                {
                                    kind: "enyo.FittableColumns",
                                    classes: "moon-music-item-column",
                                    fit: true,
                                    components: [
                                        {
                                            name: "image2",
                                            fit: true,
                                            classes: "moon-music-item-image",
                                            components: [{classes: "moon-play-icon"}]
                                        },
                                        {style: "display: table-cell; width: 20px;"},
                                        {
                                            classes: "moon-music-item-label",
                                            components: [
                                                {name: "track2", classes: "moon-music-item-track"},
                                                {name: "artist2", classes: "moon-music-item-artist"}
                                            ]
                                        },
                                        {name: "time2", classes: "moon-music-item-label-right"}
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
        this.resizeList();
    },
    
    resizeList: function() {
        var rect = this.$.container.getBounds();
        this.$.list.setBounds({top: rect.top});
    },
    
    setupItem: function(inSender, inEvent) {
        var index = inEvent.index * 2;
        var url = "assets/default-music.png";
		this.$.image.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist");
		this.$.time.setContent("3:40");
        
        index++;
        if (index < this.count) {
            this.$.image2.setShowing(true);
            this.$.image2.setStyle("background-image: url(" + url + ");");
    		this.$.track2.setContent("Track Name");
    		this.$.artist2.setContent("Artist");
    		this.$.time2.setContent("3:40");
        } else {
            this.$.image2.setShowing(false);
    		this.$.track2.setContent("");
    		this.$.artist2.setContent("");
    		this.$.time2.setContent("");
        }
	}
});
