enyo.kind({
    name: "moon.sample.music.TrackDetailWideSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-track-detail",
    fit: true,
    title: "Track Name",
    titleAbove: "03",
    titleBelow: "Artist Name",
    headerComponents: [
        {
            classes: "header",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-album.png"},
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-download.png",
                    classes: "right-button"
                },
                {
                    kind: "moon.IconButton",
                    src: "assets/icon-like.png",
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
                    kind: "FittableRows",
                    classes: "detail",
                    components: [
                        {
                            name: "movie",
                            classes: "preview",
                            components: [{name: "play", classes: "play-icon"}]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "info",
                            components: [
                                {classes: "title", content: "Released"},
                                {classes: "content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "info",
                            components: [
                                {classes: "title", content: "Genre"},
                                {classes: "content", content: "Ballad"}
                            ]
                        }
                    ]
                },
                {
                    kind: "FittableRows",
                    classes: "lyrics",
                    components: [
                        {
                            kind: "moon.Divider",
                            classes: "lyrics-devider",
                            content: "Lyrics"
                        },
                        {
                            classes: "content",
                            components: [
                                {
                                    allowHtml: true,
                                    content: "Can't see the lights or the blue orange\
                                              signs<br />Can't see the road or the\
                                              long white lines<br />Feeling the ground\
                                              through the pedals on the floor<br />\
                                              Felling death pounding at the door<br />\
                                              <br />Windows all open, chaos in my hair\
                                              <br />Driving me round and leaving me\
                                              there<br />Cover my eyes and we'll die\
                                              driving blind<br />Cover my trail and\
                                              we'll leave this life behind<br /><br />\
                                              Drive blind<br /><br />All at onec, too\
                                              mush light<br />Captured and frozen,\
                                              hear no sound<br />Bright flashes\
                                              penetrate<br />Glowing, flowing, lifting\
                                              off the ground"
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
                            {kind: "moon.SelectableItem", content: "Artist"},
                            {kind: "moon.SelectableItem", content: "Album"},
                            {kind: "moon.SelectableItem", content: "Similar Track"},
                            {kind: "moon.SelectableItem", content: "Related Videos"}
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
        var d = this.$.detail.getBounds().width;
        this.$.movie.setBounds({width: d, height: d});
        
        d = Math.round((d - 168) * 0.5);
        this.$.play.setStyle("margin: " + d + "px 0px 0px " + d + "px;");
    }
});
