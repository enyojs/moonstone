enyo.kind({
    name: "moon.sample.wizard.PopupConfirmationSample",
    kind: "moon.Panel",
    classes: "moon-wizard-popup-sample enyo-fit",
    layoutKind: "FittableRowsLayout",
    handlers: {
        onchange: "inputChanged",
    },
    events: {
        onWizardStepChanged: "",
    },    
    headerComponents: [
        {name: "wizListAction", kind: "moon.ListActions", classes: "wizard-listaction", iconSrc:"./assets/icon-list.png",
            listActions: [
            {               
                components: [
                    {kind: "moon.Divider", content:"Category"},
                    {name: "wizList", kind: "moon.DataList", style:"display:inline-block", components: [
                        {kind:"moon.Item", classes: "wizard-listaction-item", bindFrom: "step", bindTo: "content"},
                        {classes: "wizard-listaction-text", bindFrom: "processed", bindTo: "content"}
                    ]}
                ]
            }]
        }    
    ],
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
        {from: ".controller.wizResults", to: "$.resultList.controller"},
        {from: ".controller.wizResults", to: ".$.header.$.wizListAction.$.listActionsContainer.$.wizList.controller"}
    ],
    rendered: function() {
        this.inherited(arguments);
        this.initialSetting(); 
        return true;
    },
    initialSetting: function() {
        // popup
        this.$.header.addClass("wizard-hide"); // I'm waiting short header
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle")); 
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
        return true;
    },
    prevTap: function(inSender, inEvent) {  
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizResults");
        collection.at(idx).set("result", " -- ");
        collection.at(idx).set("processed", "[FALSE]");
        this.doWizardStepChanged({cmd:"previous"});
        return true;
    },
    doneTap: function(inSender, inEvent) {
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizResults");
        collection.at(idx).set("processed", "[TRUE]");
        this.doWizardStepChanged({cmd:"done"});
        return true;
    }
});
