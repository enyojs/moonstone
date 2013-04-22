enyo.kind({
    name: "moon.VideoDetailNarrowSample",
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
                    name: "synopsis",
                    components: [
                        {
                            kind: "FittableRows",
                            components: [
                                {kind: "moon.Divider", classes: "moon-video-detail-synopsis", content: "Synopsis"},
                                {
                                    classes: "moon-video-detail-content",
                                    components: [
                                        {allowHtml: true, content: "<b>Staring: </b>Actor Name, Actor Name, and Actor Name"},
                                        {tag: "br"},
                                        {
                                            content: "Pixar genius reigns in this funny romantic comedy, which stars a robot who says absolutely nothing for a full 25 minutes yet somehow completely transfixes and endears himself to the audience within the first few minutes of the film. As the last robot left on earth, Wall-E (voiced by Ben Burtt) is one small robot--with a big, big heart--who holds the future of earth and mankind squarely in the palm of his metal hand. He's outlasted all the \"Waste Allocation Load Lifter Earth-Class\" robots that were assigned some 700 years ago to clean up the environmental mess that man made of earth while man vacationed aboard the luxury spaceship Axiom."
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
        var w = this.$.detail.getBounds().width;
        var h = Math.round(w * 353 / 627);
        this.$.movie.setBounds({width: w, height: h});
        
        w = Math.round((w - 160) * 0.5);
        h = Math.round((h - 160) * 0.5);
        this.$.play.setStyle("margin: " + h + "px 0px 0px " + w + "px;");
    }
});
