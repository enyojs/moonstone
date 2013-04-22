enyo.kind({
    name: "moon.sample.music.RelatedVideosNarrowSample",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-music-detail",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            content: "Related Videos",
            titleAbove: "04",
            titleBelow: "10 Tracks"
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
                                                        {name: "title"},
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
        var rect = this.$.listContainer.getBounds();
        this.$.list.setBounds({top: rect.top, left: rect.left});
    },
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.image.setStyle("background-image: url(" + url + ");");
		this.$.title.setContent("Video Title");
		this.$.time.setContent("3:40");
	}
});
