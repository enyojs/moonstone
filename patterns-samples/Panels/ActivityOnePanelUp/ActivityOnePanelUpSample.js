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
    name: "moon.sample.panels.ActivityOnePanelUpSample",
    style: "background: #eaeaea;",
    classes: "moon enyo-fit",
    components: [
        {kind: "enyo.Spotlight"},
        {name: "panels", kind: "moon.Panels", arrangerKind: "moon.LeanForwardArranger", onTransitionFinish: "panelsTransitionFinish", classes: "enyo-fit", components: [
            {kind: "moon.sample.video.MainMenuWideSample", ontap: "mainMenuTapped"}
        ]}
    ],
    
    mainMenuTapped: function(inSender, inEvent) {   
        switch (inEvent.originator.content) {
            case "Browser Movies": {
                this.$.panels.push({kind: "moon.sample.video.BrowserMoviesWideSampleExtend", onSelect: "gridListTapped"}, {owner: this});
            }
        }  
    },

    gridListTapped: function(inSender, inEvent) {
        var item = inEvent.selectedItem;
        if (item) {
            this.$.panels.push({kind: "moon.sample.video.DetailWideSample"}, {owner: this});
        }
    },
    panelsTransitionFinish: function(inSender, inEvent) {
        if (inEvent.fromIndex > inEvent.toIndex && inEvent.toIndex > 0) {
            this.$.panels.pop(inEvent.toIndex+1);
        }
    }
});