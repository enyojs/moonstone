enyo.kind({
    name: "moon.sample.music.RelatedVideosNarrowSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-related-video",
    fit: true,
    title: "Related Videos",
    titleAbove: "04",
    titleBelow: "10 Tracks",
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
                                {name: "title"},
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
        h -= this.$.list.getAbsoluteBounds().top;
        this.$.list.setBounds({height: h});
    },
    
    setupItem: function(inSender, inEvent) {
        var url = "assets/default-music.png";
		this.$.preview.setStyle("background-image: url(" + url + ");");
		this.$.title.setContent("Video Title");
		this.$.time.setContent("3:40");
	}
});
