enyo.kind({
    name: "moon.sample.photos.AlbumPhotoGridSampleExtend",
    kind: "moon.sample.photos.AlbumPhotoGridSample",
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
    name: "moon.sample.panels.ActivityPhotoAlbumFlowSample",
    style: "background: #eaeaea;",
    classes: "moon enyo-fit",
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.LeanForwardArranger", onTransitionFinish: "panelsTransitionFinish", classes: "enyo-fit", components: [
            {kind: "moon.sample.photos.AlbumListWideSample", ontap: "albumListTapped"},
            {kind: "moon.sample.photos.AlbumPhotoGridSampleExtend", onSelect: "photoGridTapped"}
        ]}
    ],
    
    albumListTapped: function(inSender, inEvent) {
        this.$.panels.next();
        return true;
    },

    photoGridTapped: function(inSender, inEvent) {
        var item = inEvent.selectedItem;
        if (item) {
            this.$.panels.push({kind: "moon.sample.photos.PhotoDetailWideSample"}, {owner: this});
        }
    },
    panelsTransitionFinish: function(inSender, inEvent) {
        if (inEvent.fromIndex > inEvent.toIndex && inEvent.toIndex > 0) {
            this.$.panels.pop(inEvent.toIndex+1);
        }
    }
});