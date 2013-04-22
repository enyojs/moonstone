enyo.kind({
    name: "moon.sample.music.LyricsDetailSample",
    kind: "moon.Panel",
    classes: "enyo-unselectable moon moon-music-mainmenu",
    fit: true,
    index: "04",
    title: "LYRICS",
    
    components: [
        {kind: "enyo.Spotlight"},
        {
            content: "Can't see the lights or the blue orange sigs " + "\n"
                    + "Can't see the road or the long white lines "
                    + "Feeling the ground throung the pedals on the floor "

                    + "Feeling death pounding at the door "
        }
    ],  
});