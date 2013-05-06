enyo.kind({
    name: "moon.sample.music.TrackOneColumnWideSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-track-one-column",
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
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "list",
            kind: "moon.List",
            style: "height: 300px;",
            classes: "list",
            count: 15,
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
                        {classes: "label", components: [
                            {name: "track", classes: "content"}
                        ]},
                        {classes: "label", components: [
                            {name: "artist", classes: "content"}
                        ]},
                        {classes: "label", components: [
                            {name: "album", classes: "content"}
                        ]},
                        {name: "time", classes: "time"}
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
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.album.setContent("Album Name");
		this.$.time.setContent("3:40");
	}
});
