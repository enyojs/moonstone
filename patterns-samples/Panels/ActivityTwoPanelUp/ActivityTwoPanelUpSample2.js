enyo.kind({
    name: "moon.sample.video.BrowserMoviesWideSampleExtend",
    kind: "moon.sample.video.BrowserMoviesWideSample",
    handlers: {
        ontap: "tapHandler"
    },
    events: {
        onSelect: ""
    },
    tapHandler: function(inSender, inEvent) {
        var item = this.getItem(inEvent.index);
        if (!item) {
            return true;
        }
        
        inEvent.selectedItem = item;
        this.doSelect(inEvent);
        
        return true
    },
    getItem: function(inIndex) {
        return this.$.gridlist.controls[inIndex];
    }
});

enyo.kind({
    name: "moon.sample.panels.ActivityTwoPanelUpSample2",
    style: "background: #eaeaea;",
    classes: "moon enyo-fit",
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.LeanForwardArranger", onTransitionFinish: "panelsTransitionFinish", classes: "enyo-fit", components: [
            {kind: "moon.sample.video.MainMenuNarrowSample"},
            {kind: "moon.sample.video.BrowserMoviesWideSampleExtend", joinToPrev: true, onSelect: "gridListTapped"},
        ]}
    ],

    detailPanel: [
        {kind: "moon.sample.video.DetailNarrowSample2"}, 
        {kind: "moon.sample.video.SynopsisNarrowSample", style: "width: 640px", joinToPrev: true}
    ],

    gridListTapped: function(inSender, inEvent) {
        var item = inEvent.selectedItem;
        if (item) {    
            this.$.panels.pushs(this.detailPanel, {owner: this});
        }
    },
    panelsTransitionFinish: function(inSender, inEvent) {
        if (inEvent.fromIndex > inEvent.toIndex && inEvent.toIndex > 0) {
            this.$.panels.pop(inEvent.toIndex+1);
        }
    }
});