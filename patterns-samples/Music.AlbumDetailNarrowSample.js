enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-detail",
    fit: true,
    titleAbove: "04",
    title: "Album",    
    titleBelow: "",
    components: [
        {kind: "enyo.Spotlight"},
        {
            name: "detail",
            kind: "FittableRows",
            classes: "moon-music-detail-detail",
            components: [
                {
                    kind: "FittableColumns",
                    components: [
                        {
                            classes: "moon-music-detail-preview",
                            components: [{name: "play", classes: "moon-play-icon"}]
                        },
                        {
                            kind: "FittableRows",
                            fit: true,
                            components: [
                                {classes: "moon-music-item-label", content: "Album Title"},
                                {
                                    kind: "FittableColumns",
                                    components: [
                                        {classes: "moon-music-artist", content: "ARTIST"},
                                        {classes: "moon-music-artist-content", content: "Justin Bieber"}
                                    ]
                                },
                                {
                                    kind: "FittableColumns",
                                    components: [
                                        {classes: "moon-music-artist", content: "RELEASED"},
                                        {classes: "moon-music-artist-content", content: "5 April 2013"}
                                    ]
                                },
                                {
                                    kind: "FittableColumns",
                                    components: [
                                        {classes: "moon-music-artist", content: "GENRE"},
                                        {classes: "moon-music-artist-content", content: "Dance"}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {kind: "moon.Divider", classes: "moon-music-detail-top-devider", content: "SONGS"},
                {
                    name: "list",
                    kind: "moon.List",
                    count: 100,
                    style: "height: 800px",
                    multiSelect: false,
            		onSetupItem: "setupItem",
                    components: [
            			{
                            name: "item",
                            kind: "enyo.FittableColumns",
                            classes: "moon-music-item",
                            fit: true,
                            components: [
                                {name: "index"},
                                {style: "display: table-cell; width: 5px;"},
                                {name: "track"},
                                {style: "display: table-cell; width: 5px;"},
                                {name: "time", classes: "moon-music-item-label-small"}
                            ]
                        }
            		]
                }
            ]
        }
    ],

    headerComponents: [
        {classes: "moon-music-detail-header-button", components: [
            {kind: "moon.IconButton", src: "assets/icon-like.png"},
            {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
        ]}
    ],
       
    setupItem: function(inSender, inEvent) {
        this.$.index.setContent(inEvent.index);
		this.$.track.setContent("Track Name");
		this.$.time.setContent("3:40");
	}
});
