enyo.kind({
    name: "moon.sample.search.TVShowDetailSamples",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon",
    fit: true,
    spotlight: false,
    title: "episodes",
    titleAbove: "04",
    headerComponents: [
        {kind: "moon.IconButton", src: "assets/icon-list.png"}
    ],
    components: [
        {kind: "enyo.Spotlight"},
        {kind: "moon.sample.search.episodes"}
    ],

});
enyo.kind({
    //* @public
    name: "moon.sample.search.episodes",
    //* @protected
    components: [
        {name: "items", kind: "Repeater", onSetupItem: "setupItem", count: 9, components: [
            {name: "item", spotlight: true, classes: "item", components: [
                {name: "itemText", classes: "item-text"}
            ]}
        ]}
    ],
    setupItem: function(inSender, inEvent) {
        var item = inEvent.item;
        item.$.item.applyStyle("background-image", "url('./assets/default-movie.png');");
        item.$.itemText.setContent("EPISODE NAME");
    }

    //* @public

    // Do something
});               
