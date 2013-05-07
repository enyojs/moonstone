enyo.kind({
    name: "moon.sample.photos.PhotoGridSampleExtend",
    kind: "moon.sample.photos.PhotoGridSample",
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
    name: "moon.sample.photos.ActivityAlternateLayoutsSample",
    style: "background: #eaeaea;",
    classes: "moon enyo-fit",
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.LeanForwardArranger", onTransitionFinish: "panelsTransitionFinish", classes: "enyo-fit", components: [
            {kind: "moon.sample.photos.AlbumListNarrowSample", ontap: "albumListTapped"},
            {kind: "moon.sample.photos.PhotoGridSampleExtend", joinToPrev: true, onSelect: "photoGridTapped"}
        ]}
    ],
    
    albumListTapped: function(inSender, inEvent) {
        /**
            describe some actions here
        */
        return true;
    },

    detailPanel: [
        {kind: "moon.sample.photos.PhotoListNarrowSample", style: "width: 240px",}, 
        {kind: "moon.sample.photos.PhotoDetailWideSample", joinToPrev: true}
    ],

    photoGridTapped: function(inSender, inEvent) {
        
        var item = inEvent.selectedItem;
        if (item) {    
            this.$.panels.pop();
            this.$.panels.pushs(this.detailPanel, {owner: this});
        }
    },
    panelsTransitionFinish: function(inSender, inEvent) {
        if (inEvent.fromIndex > inEvent.toIndex && inEvent.toIndex > 0) {
            this.$.panels.pop(inEvent.toIndex+1);
        }
    }
});