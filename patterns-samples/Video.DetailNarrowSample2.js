enyo.kind({
    name: "moon.VideoDetailNarrowSample2",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-video-detail",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    handler: {onresize: "resizeHandler"},
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            content: "Movie Name",
            titleAbove: "03",
            components: [
                {
                    classes: "moon-video-detail-header-button",
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-download.png"},
                        {kind: "moon.IconButton", src: "assets/icon-favorite.png", classes: "moon-video-detail-header-button-right"},
                        {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-video-detail-header-button-right"}
                    ]
                }
            ]
        },
        {
            name: "container",
            kind: "FittableColumns",
            classes: "moon-video-detail-container",
            fit: true,
            components: [
                {
                    name: "detail",
                    classes: "moon-video-detail-detail",
                    components: [
                        {
                            name: "movie",
                            classes: "moon-video-detail-preview",
                            components: [{name: "play", classes: "moon-play-icon"}]
                        },
                        {
                            name: "info",
                            kind: "FittableColumns",
                            classes: "moon-video-detail-info",
                            components: [
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "FittableRows",
                                            classes: "moon-video-detail-devider-group",
                                            components: [
                                                {kind: "moon.Divider", classes: "moon-video-detail-devider", content: "Rating"},
                                                {tag: "b", classes: "moon-video-detail-big-text", content: "PG-13"}
                                            ]
                                        },
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "SD",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "3", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
                                        }
                                    ]
                                },
                                {style: "width: 11%;"},
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "FittableRows",
                                            classes: "moon-video-detail-devider-group",
                                            components: [
                                                {kind: "moon.Divider", classes: "moon-video-detail-devider", content: "Release Date"},
                                                {tag: "b", classes: "moon-video-detail-big-text", content: "2013"}
                                            ]
                                        },
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "HD",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "6", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
                                        }
                                    ]
                                },
                                {style: "width: 11%;"},
                                {
                                    style: "width: 26%;",
                                    components: [
                                        {
                                            kind: "FittableColumns",
                                            classes: "moon-video-detail-devider-group",
                                            components: [
                                                {
                                                    kind: "FittableRows",
                                                    fit: true,
                                                    components: [
                                                        {kind: "moon.Divider", classes: "moon-video-detail-devider", content: "Running Time"},
                                                        {
                                                            kind: "FittableColumns",
                                                            components: [
                                                                {tag: "b", classes: "moon-video-detail-big-text", content: "122"},
                                                                {content: "min", classes: "moon-video-detail-sub-text"}
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            kind: "moon.CaptionDecorator",
                                            side: "top",
                                            content: "3D",
                                            components: [
                            					{
                            						kind: "moon.Button",
                            						components: [
                            							{content: "$", classes: "moon-pre-text"},
                            							{content: "7", classes: "moon-large-text"},
                            							{content: "99", classes: "moon-superscript"}
                            						]
                            					}
                                            ]
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
                        {kind: "moon.Divider", classes: "moon-video-detail-more", content: "More"},
                        {kind: "Group", components: [
                            {kind: "moon.SelectableItem", content: "Synopsis", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Trailers", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Also Watched", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Recommendations", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Reviews", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Cast", spotlight: true}
                        ]}
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
        var w = this.$.detail.getBounds().width;
        var h = Math.round(w * 353 / 627);
        this.$.movie.setBounds({width: w, height: h});
        
        w = Math.round((w - 160) * 0.5);
        h = Math.round((h - 160) * 0.5);
        this.$.play.setStyle("margin: " + h + "px 0px 0px " + w + "px;");
    }
});
