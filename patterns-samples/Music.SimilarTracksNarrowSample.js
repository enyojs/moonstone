enyo.kind({
    name: "moon.sample.music.SimilarTracksNarrowSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-similar-tracks",
    fit: true,
    spotlight: false,
    title: "Similar Tracks",
    titleAbove: "04",
    titleBelow: "10 Tracks",
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
            name: "list",
            kind: "moon.List",
            style: "height: 300px;",
            classes: "list",
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
                            classes: "content",
                            components: [
                                {name: "track"},
                                {name: "artist", classes: "small-content"},
                                {name: "time", classes: "small-content"}
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
        h -= this.$.list.getAbsoluteBounds().top + 20;
        this.$.list.setBounds({height: h});
    },
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.time.setContent("3:40");
	}
});
