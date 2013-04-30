enyo.kind({
    name: "albumArt",
    published: {
        src: ""
    },
    components: [
        {name: "button", kind: moon.IconButton, src: "assets/icon-play.png", classes: "moon-play-icon"},
        {name: "image", kind: enyo.Image, classes: "moon-album-cover-art"}
    ],
    create: function() {
        this.inherited(arguments);
        this.srcChanged();
    },
    srcChanged: function() {
        this.$.image.setSrc(this.src);
    }
});

enyo.kind({
    name: "moon.sample.music.AlbumDetailWideSample",
    kind: moon.Panel,
    classes: "enyo-unselectable moon moon-music-detail",
    titleAbove: "04",
    title: "Album",
    titleBelow: "ALBUM TITLE (ARTISTS)",
    headerComponents: [
        {kind: moon.IconButton, src: "assets/icon-download.png"},
        {kind: moon.IconButton, src: "assets/icon-favorite.png", classes: "moon-header-button-right"},
        {kind: moon.IconButton, src: "assets/icon-next.png", classes: "moon-header-button-right"}
    ],
    components: [
        {kind: "Spotlight"},
        {kind: enyo.FittableColumns, classes: "moon-music-album-detail-container", components: [
            {kind: enyo.FittableRows, classes: "moon-music-album-detail-wide-left", components: [
                {kind: "albumArt", name: "AlbumArt", src: "assets/album.PNG", classes: "moon-album-cover-art"},
                {kind: enyo.FittableColumns, components: [
                    {content: "RELEASED", classes: "moon-album-label"},
                    {content: "5 April 2013", classes: "moon-album-label-value"},
                ]},
                {kind: enyo.FittableColumns, components: [
                    {content: "GENRE", classes: "moon-album-label"},
                    {content: "Dance", classes: "moon-album-label-value"},
                ]}
            ]},
            {kind: enyo.FittableRows, classes: "moon-music-album-detail-wide-right", components: [
                {kind: "moon.Divider", name: "tracklistheader", classes: "moon-music-detail-divider", content: "11 TRACKS"},
                {kind: moon.List, name: "tracklist", spotlight: "container", fit:true, orient:"v", count: 10, onSetupItem: "setupItem", classes: "moon-music-detail-wide-tracklist", components: [
                    {name: "item", components: [
                        {name: "tracknum", classes: "moon-music-detail-wide-tracklist-tracknum enyo-inline "},
                        {name: "trackname", classes: "moon-music-detail-wide-tracklist-trackname enyo-inline "},
                        {name: "artistname", classes: "moon-music-detail-wide-tracklist-artistname enyo-inline "},
                        {name: "runningtime", classes: "moon-music-detail-wide-tracklist-runningtime enyo-inline "}
                    ]}
                ]}
            ]}
        ]}
    ],
    setupItem: function(inSender, inEvent) {
        var i = inEvent.index + 1;
        var ni = ("0" + i).slice(-2);
        this.$.tracknum.setContent(ni); 
        this.$.trackname.setContent("track name"); 
        this.$.artistname.setContent("artist name");
        this.$.runningtime.setContent("3:40");
    },
    create: function() {
        this.inherited(arguments);
        this.$.tracklistheader.setContent(this.$.tracklist.getCount() + " TRACKS");
    }
});
