enyo.kind({
    name: "moon.MusicTrackOneColumnWideSample2",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-music-trackonecolumn",
    fit: true,
    title: "Browser Tracks",
    titleAbove: "02",
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            classes: "moon-music-trackonecolumn-header",
            content: "Browser Tracks",
            titleAbove: "02",
            titleBelow: "15 Tracks",
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
                    count: 15,
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
                                    components: [{classes: "moon-play-icon"}]
                                },
                                {style: "display: table-cell; width: 20px;"},
                                {classes: "moon-music-item-label", components: [{name: "track", classes: "moon-music-item-label-content"}]},
                                {classes: "moon-music-item-label", components: [{name: "artist", classes: "moon-music-item-label-content"}]},
                                {classes: "moon-music-item-label", components: [{name: "album", classes: "moon-music-item-label-content"}]},
                                {name: "time", classes: "moon-music-item-label-right"}
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
        var url = "assets/default-music.png";
		this.$.image.setStyle("background-image: url(" + url + ");");
		this.$.track.setContent("Track Name");
		this.$.artist.setContent("Artist Name");
		this.$.album.setContent("Album Name");
		this.$.time.setContent("3:40");
	}
});
