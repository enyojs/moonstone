enyo.kind({
    name: "moon.sample.video.DetailNarrowSample2",
    kind: "moon.Panel",
    layoutKind: "FittableColumnsLayout",
    title: "Movie Name",
    titleAbove: "03",
    headerComponents: [
        {kind: "moon.IconButton", src: "assets/icon-download.png"},
        {kind: "moon.IconButton", src: "assets/icon-favorite.png"},
        {kind: "moon.IconButton", src: "assets/icon-next.png"}
    ],
    components: [
        {kind: "enyo.Spotlight"},
        {
            kind: "FittableRows",
            components: [
                {
                    name: "movie", kind: "enyo.Image", style: "width: 600px; height: 320px;"
                },
                {
                    kind: "HFlexBox",
                    components: [
                        {flex: true, components: [
                            {kind: "moon.Divider", content: "Rating"},
                            {name: "rating"}
                        ]},
                        {flex: true, components: [
                            {kind: "moon.Divider", content: "Release Date"},
                            {name: "releaseDate"}
                        ]},
                        {flex: true, components: [
                            {kind: "moon.Divider", content: "Running Time"},
                            {name: "duration"}
                        ]}
                    ]
                },
                {
                    kind: "HFlexBox",
                    components: [
                        {flex: true, components: [
                            {content: "SD"},
                            {name: "valueSD"}
                        ]},
                        {flex: true, components: [
                            {content: "HD"},
                            {name: "valueHD"}
                        ]},
                        {flex: true, components: [
                            {content: "3D"},
                            {name: "value3D"}
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
        {from: ".controller.posterUrl", to: "$.movie.src"},
        {from: ".controller.rating", to: "$.rating.content"},
        {from: ".controller.releaseDate", to: "$.releaseDate.content"},
        {from: ".controller.duration", to: "$.duration.content"},
        {from: ".controller.valueSD", to: "$.valueSD.content"},
        {from: ".controller.valueHD", to: "$.valueHD.content"},
        {from: ".controller.value3D", to: "$.value3D.content"}
    ]
});

// Sample model

enyo.ready(function(){
    var sampleModel = new enyo.Model({
        posterUrl: "http://upload.wikimedia.org/wikipedia/en/7/70/Ironmanposter.JPG",
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
                {kind: "enyo.Spotlight"},
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
                model: sampleModel,
            }
        ]
    });
});
