enyo.kind({
    name: "moon.sample.video.DetailNarrowSample2",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    title: "Movie Name",
    titleAbove: "03",
    headerComponents: [
        {kind: "moon.IconButton", src: "../assets/icon-download.png"},
        {kind: "moon.IconButton", src: "../assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "../assets/icon-next.png"}
    ],
    components: [
        {
            kind:"moon.Scroller",
            components:[
                {name: "movie", kind: "enyo.Image", classes: "moon-7h moon-8v"},
                {
                    kind:"FittableColumns",
                    components: [
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Rating"},
                            {kind:"moon.BodyText", name: "rating"}
                        ]},
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Release Date"},
                            {kind:"moon.BodyText", name: "releaseDate"}
                        ]},
                        {kind:"moon.BodyText", components: [
                            {kind: "moon.Divider", content: "Running Time"},
                            {kind:"moon.BodyText", name: "duration"}
                        ]}
                    ]
                },
                {
                    kind:"FittableColumns",
                    components: [
                        {kind: "moon.BodyText", components: [
                            {content: "SD", style:"text-align: center;"},
                            {kind:"moon.Button", name: "valueSD"}
                        ]},
                        {kind: "moon.BodyText", components: [
                            {content: "HD", style:"text-align: center;"},
                            {kind:"moon.Button", name: "valueHD"}
                        ]},
                        {kind: "moon.BodyText", components: [
                            {content: "3D", style:"text-align: center;"},
                            {kind:"moon.Button", name: "value3D"}
                        ]}
                    ]
                }
            ]
        },
        {
            name: "more",
            fit: true,
            components: [
                {kind: "moon.Divider", content: "More"},
                {kind: "Group", components: [
                    {kind: "moon.SelectableItem", content: "Synopsis"},
                    {kind: "moon.SelectableItem", content: "Trailers"},
                    {kind: "moon.SelectableItem", content: "Also Watched"},
                    {kind: "moon.SelectableItem", content: "Recommendations"},
                    {kind: "moon.SelectableItem", content: "Reviews"},
                    {kind: "moon.SelectableItem", content: "Cast"}
                ]}
            ]
        }
    ],

    bindings: [
        {from: ".controller.posterUrl", to: ".$.movie.src"},
        {from: ".controller.rating", to: ".$.rating.content"},
        {from: ".controller.releaseDate", to: ".$.releaseDate.content"},
        {from: ".controller.duration", to: ".$.duration.content"},
        {from: ".controller.valueSD", to: ".$.valueSD.content"},
        {from: ".controller.valueHD", to: ".$.valueHD.content"},
        {from: ".controller.value3D", to: ".$.value3D.content"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        posterUrl: "http://placehold.it/550x350",
        rating: "PG-13",
        releaseDate: "2013",
        duration: "122",
        valueSD: "$3.99",
        valueHD: "$6.99",
        value3D: "$7.99"
    });

//  Application to render sample

    new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {
                    kind: "moon.sample.video.DetailNarrowSample2",
                    controller: ".app.controllers.movieController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [
            {
                name: "movieController",
                kind: "enyo.ModelController",
                model: sampleModel
            }
        ]
    });
});