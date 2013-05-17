// Sample View

enyo.kind({
    name: "music.PlayIconButton",
    published: {
        src: ""
    },
    classes: "moon-music-item-image",
    components: [{classes: "moon-play-music-icon"}],
    create: function() {
        this.inherited(arguments);
        this.srcChanged();
    },
    srcChanged: function(inOld) {
        this.setStyle("background-image: url(" + this.src + ");");
    }
});


enyo.kind({
    name: "moon.sample.music.SimilarTracksNarrowSample",
    kind: "moon.Panel",
	classes: "enyo-unselectable moon moon-music-detail",
    title: "Similar Tracks",
    titleAbove: "04",
    titleBelow: "10 Tracks",
    headerComponents: [
        {
            classes: "moon-music-detail-header-button",
            components: [
                {kind: "moon.IconButton", src: "assets/icon-like.png"},
                {kind: "moon.IconButton", src: "assets/icon-next.png", classes: "moon-music-detail-header-button-right"}
            ]
        }
    ],
    components: [
        {
            name: "trackList",
            kind: "moon.DataList",
            layoutKind: "FittableColumnsLayout",
            fit: true,
            components: [
                {
                    classes: "moon-music-item",
                    components: [
                        {kind: "music.PlayIconButton", bindFrom: "coverUrl", bindTo: "src"},
                        {style: "display: table-cell; width: 20px;"},
                        {
                            classes: "moon-music-item-label",
                            components: [
                                {bindFrom: "track"},
                                {bindFrom: "artist", classes: "moon-music-item-label-small"},
                                {bindFrom: "time", classes: "moon-music-item-label-small"}
                            ]
                        }
                    ]
                }    
    		]
        }
    ],
    bindings: [
        {from: ".controller.track", to: "$.trackList.controller"}
    ]
});

// Sample model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        track: new enyo.Collection([
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"},
            {coverUrl: "assets/default-music.png", track: "Track name", artist: "Artist name", time: "3:40"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.SimilarTracksNarrowSample",
                    controller: ".app.controllers.trackController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "trackController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeVideoName: function(inSender, inEvent) {
                    inSender.parent.controller.set("title", "Good video");
                }
            }
        ]
    });
});