enyo.kind({
    name: "moon.sample.wizard.FullScreenConfirmationSample",
    kind: "moon.Panel",
    classes: "moon-wizard-sample enyo-fit",
    layoutKind: "FittableRowsLayout",
    events: {
        onWizardStepChanged: ""
    },

    components: [
        {     
            spotlight: true, 
            components: [     
                {name: "done", kind: "moon.Button", classes: "wizard-button-top", ontap: "doneTap", content: "Done"},
                {name: "prev", kind: "moon.Button", classes: "wizard-button-top", ontap: "prevTap", content: "Previous"}          
            ]
        },
        {
            components: [
                {
                    fit: true,
                    name: "wizardview",
                    classes: "confirm-window",
                    components: [
                        {name: "headline", classes: "wizard-instruction"},
                        {
                            name: "resultList",
                            kind: "moon.DataList",
                            classes: "wizard-datalist-wrapper", 
                            components: [
                                {
                                    classes: "wizard-datalist",
                                    components: [
                                        {style: "display: inline-block", bindFrom: "step", bindTo: "content"},
                                        {style: "display: inline-block", bindFrom: "result", bindTo: "content"},
                                        {style: "display: inline-block", bindFrom: "processed", bindTo: "content"}
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
        {from: ".controller.title", to: ".title"},
        {from: ".controller.wizResults", to: "$.resultList.controller"}
    ],
    initialSetting: function() {
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle")); 
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
    },
    rendered: function() {
        this.inherited(arguments);
        this.initialSetting(); 
    },
    prevTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"previous"});
    },
    doneTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"done"});
    }
});
