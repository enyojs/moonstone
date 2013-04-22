enyo.kind({
    name: "moon.sample.music.TrackDetailNarrowSample",
    layoutKind: "enyo.FittableRowsLayout",
	classes: "enyo-unselectable moon moon-music-detail",
    fit: true,
    title: "Movie Name",
    titleAbove: "03",
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "moon.Header",
            content: "Track Name",
            titleAbove: "03",
            titleBelow: "Artist Name",
            components: [
                {
                    classes: "moon-music-detail-header-button",
                    components: [
                        {kind: "moon.IconButton", src: "assets/icon-album.png"},
                        {kind: "moon.IconButton", src: "assets/icon-download.png", classes: "moon-music-detail-header-button-right"},
                        {kind: "moon.IconButton", src: "assets/icon-like.png", classes: "moon-music-detail-header-button-right"},
                        {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
                    ]
                }
            ]
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
                            name: "movie",
                            classes: "moon-music-detail-preview",
                            components: [{name: "play", classes: "moon-play-icon"}]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "moon-music-detail-info",
                            components: [
                                {classes: "moon-music-detail-title", content: "Released"},
                                {classes: "moon-music-detail-content", content: "5 April 2013"}
                            ]
                        },
                        {
                            kind: "FittableColumns",
                            classes: "moon-music-detail-info",
                            components: [
                                {classes: "moon-music-detail-title", content: "Genre"},
                                {classes: "moon-music-detail-content", content: "Ballad"}
                            ]
                        }
                    ]
                },
                {
                    name: "more",
                    fit: true,
                    components: [
                        {kind: "moon.Divider", classes: "moon-music-detail-more", content: "More"},
                        {kind: "Group", components: [
                            {kind: "moon.SelectableItem", content: "Lyrics", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Artist", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Album", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Similar Track", spotlight: true},
                            {kind: "moon.SelectableItem", content: "Related Videos", spotlight: true}
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
