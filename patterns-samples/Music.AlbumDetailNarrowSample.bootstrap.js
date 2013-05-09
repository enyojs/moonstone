enyo.ready(function(){
    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.music.AlbumDetailNarrowSample",
                    controller: "moon.sample.music.AlbumDetailNarrowSampleController",
                    classes: "enyo-fit"
                }
            ]
        }
    });
});



enyo.kind({
    name: "moon.sample.music.AlbumDetailNarrowSampleController",
    kind: "enyo.ObjectController",
    data: {
        artist: "Queen",
        album: "Greatest Hits",
        releaseDate: "5 April 2013",
        genre: "Rock",
        tracks: [
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "1", name: "Bohemian Rhapsody", duration: "3:40", price: "$0.99"},
            {number: "2", name: "Killer Queen", duration: "3:30", price: "$1.99"}
        ],
        coverUrl: "http://placehold.it/200x200"
    },
    changeTrackName: function(inSender, inEvent) {
        inSender.parent.controller.set("name", "We are the Champions");
    }
});