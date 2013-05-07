enyo.kind({
    name: "moon.sample.video.DetailWideSample2",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-video-detail",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    headerComponents: [
        {
            classes: "header",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-download.png"},
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-favorite.png",
                    classes: "right-button"
                },
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
            kind: "FittableColumns",
            classes: "client",
            fit: true,
            components: [
                {
                    name: "detail",
                    classes: "detail",
                    components: [
                        {
                            name: "preview",
                            classes: "preview",
                            components: [{name: "play", classes: "play-icon"}]
                        }
                    ]
                },
                {
                    classes: "info",
                    components: [
                        {
                            kind: "FittableColumns",
                            components: [
                                {
                                    kind: "FittableRows",
                                    style: "width: 30%;",
                                    components: [
                                        {
                                            kind: "moon.Divider",
                                            classes: "divider",
                                            content: "Rating"
                                        },
                                        {tag: "b", classes: "big", content: "PG-13"}
                                    ]
                                },
                                {style: "width: 5%;"},
                                {
                                    kind: "FittableRows",
                                    style: "width: 30%;",
                                    components: [
                                        {
                                            kind: "moon.Divider",
                                            classes: "divider",
                                            content: "Release Date"
                                        },
                                        {tag: "b", classes: "big", content: "2013"}
                                    ]
                                },
                                {style: "width: 5%;"},
                                {
                                    kind: "FittableRows",
                                    style: "width: 30%;",
                                    components: [
                                        {
                                            kind: "moon.Divider",
                                            classes: "divider",
                                            content: "Running Time"
                                        },
                                        {
                                            kind: "FittableColumns",
                                            components: [
                                                {
                                                    tag: "b",
                                                    classes: "big",
                                                    content: "122"
                                                },
                                                {content: "min", classes: "sub"}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            kind: "moon.Divider",
                            classes: "synopsis-divider",
                            content: "Synopsis"
                        },
                        {
                            classes: "content",
                            components: [
                                {
                                    allowHtml: true,
                                    content: "<b>Starring: </b>Actor Name, Actor N" +
                                             "ame, and Actor Name"
                                },
                                {tag: "br"},
                                {
                                    content: "Pixar genius reigns in this funny ro" +
                                             "mantic comedy, which stars a robot w" +
                                             "ho says absolutely nothing for a ful" +
                                             "l 25 minutes yet somehow completely " +
                                             "transfixes and endears himself to th" +
                                             "e audience within the first few minu" +
                                             "tes of the film. As the last robot l" +
                                             "eft on earth, Wall-E (voiced by Ben " +
                                             "Burtt) is one small robot--with a bi" +
                                             "g, big heart--who holds the future o" +
                                             "f earth and mankind squarely in the " +
                                             "palm of his metal hand. He's outlast" +
                                             "ed all the \"Waste Allocation Load L" +
                                             "ifter Earth-Class\" robots that were" +
                                             " assigned some 700 years ago to clea" +
                                             "n up the environmental mess that man" +
                                             " made of earth while man vacationed " +
                                             "aboard the luxury spaceship Axiom."
                                }
                            ]
                        }
                    ]
                },
                {
                    fit: true,
                    components: [
                        {
                            kind: "moon.Divider",
                            classes: "more-divider",
                            content: "More"
                        },
                        {kind: "Group", components: [
                            {kind: "moon.SelectableItem", content: "Trailers"},
                            {kind: "moon.SelectableItem", content: "Also Watched"},
                            {kind: "moon.SelectableItem", content: "Recommendations"},
                            {kind: "moon.SelectableItem", content: "Reviews"},
                            {kind: "moon.SelectableItem", content: "Cast"}
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
        var h = Math.round(w * 650 / 425);
        this.$.preview.setBounds({width: w, height: h});
        
        w = Math.round((w - 168) * 0.5);
        h = Math.round((h - 168) * 0.5);
        this.$.play.setStyle("margin: " + h + "px 0px 0px " + w + "px;");
    }
});
