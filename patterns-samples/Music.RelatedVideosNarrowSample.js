// Sample view

enyo.kind({
    name: "moon.sample.music.RelatedVideosNarrowSample",
    kind: "moon.Panel",
    titleAbove: "04",
    title: "Related Videos",
    titleBelow: "n Videos",
    components: [
        {
            name: "videoInfo",
            kind: "moon.DataList",
            fit: true,
            components: [
                {
                    kind: "moon.Item",
                    layoutKind: "FittableColumnsLayout",
                    // To enyo.VCenter works, item needs height.
                    classes: "moon-music-item",
                    components: [
                        {
                            kind: "enyo.Image",
                            classes: "moon-music-item-image",
                            bindFrom: "coverUrl", 
                            bindTo: "src"
                        },
                        {
                            fit: true,
                            LayoutKind: "FittableRowsLayout",
                            components: [
                                {
                                    kind: "enyo.VCenter",
                                    components: [
                                        {bindFrom: "title"},
                                        {bindFrom: "time"}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    bindings: [
        {from: ".controller.videos", to: "$.videoInfo.controller"}
    ]
});

// Sample model

enyo.ready(function (){
    var sampleModel = new enyo.Model({
        videos: new enyo.Collection([
            {coverUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQDHwnqaTVagXWigAs9od_ZykEdrdgU-MlkKI764e-YhOpte4JC", title: "Monsters", time: "1:40"},
            {coverUrl: "http://www.impawards.com/1988/posters/without_a_clue_ver2.jpg", title: "Sherlock", time: "2:10"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTwR6L4-Xicn8Jmo_h5YGo_b0ggkXex8uzqtCQOclXOVrw8Mr8RNg", title: "Hooks", time: "1:40"},
            {coverUrl: "http://www.myconfinedspace.com/wp-content/uploads/2007/12/getsmart-poster-big.thumbnail.jpg", title: "Get Start", time: "2:10"},
            {coverUrl: "http://www.myconfinedspace.com/wp-content/uploads/2007/04/tron-movie-poster.jpg", title: "Tron", time: "1:40"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHy6Nzzhkp89421zfEpywMOCxS96taMY62uvXAY6pC0zqlBbqrWw", title: "Teeth", time: "2:10"},
            {coverUrl: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQDHwnqaTVagXWigAs9od_ZykEdrdgU-MlkKI764e-YhOpte4JC", title: "Monsters", time: "1:40"},
            {coverUrl: "http://www.impawards.com/1988/posters/without_a_clue_ver2.jpg", title: "Sherlock", time: "2:10"},
            {coverUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTwR6L4-Xicn8Jmo_h5YGo_b0ggkXex8uzqtCQOclXOVrw8Mr8RNg", title: "Hooks", time: "1:40"},
            {coverUrl: "http://www.myconfinedspace.com/wp-content/uploads/2007/12/getsmart-poster-big.thumbnail.jpg", title: "Get Start", time: "2:10"},
            {coverUrl: "http://www.myconfinedspace.com/wp-content/uploads/2007/04/tron-movie-poster.jpg", title: "Tron", time: "1:40"},
            {coverUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHy6Nzzhkp89421zfEpywMOCxS96taMY62uvXAY6pC0zqlBbqrWw", title: "Teeth", time: "2:10"}
        ])
    });

// Sample Application

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.RelatedVideosNarrowSample",
                    controller: ".app.controllers.videoController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "videoController",
                kind: "enyo.ModelController",
                model: sampleModel,
                changeVideoName: function(inSender, inEvent) {
                    inSender.parent.controller.set("title", "Good video");
                }
            }
        ]
    });
});
