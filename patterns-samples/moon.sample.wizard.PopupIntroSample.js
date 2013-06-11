enyo.kind({
    name: "moon.sample.wizard.PopupIntroSample",
    kind: "moon.Panel",
	classes: "moon-wizard-popup-sample enyo-fit",
    layoutKind: "FittableRowsLayout",
    published:{
        selectedText: ""
    },    
    events: {
        onWizardStepChanged: ""
    },  
    headerComponents: [
        {name: "wizListAction", kind: "moon.ListActions", classes: "wizard-listaction", iconSrc:"./assets/icon-list.png",
            listActions: [
            {                    
                components: [
                    {kind: "moon.Divider", content:"Category"},
                    {name: "wizList", kind: "moon.DataList", components: [
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
                {name: "post", kind: "moon.Button", classes: "wizard-button-top", ontap: "postTap", content: "Next"},
                {name: "prev", kind: "moon.Button", classes: "wizard-button-top", ontap: "prevTap", content: "Previous"}
            ]
        },
        {
            fit: true,
            components: [
                {
                    name: "wizardview",
                    classes: "info-window", 
                    layoutKind: "FittableColumnsLayout",
                    components: [
                        {name: "imgmenu", kind: "enyo.Image", style:"width:480px;height:320px;"},
                        { 
                            fit:true,
                            kind: "moon.Scroller",
                            horizontal: "hidden",
                            vertical: "auto",
                            components: [
                               {name: "headline", classes: "wizard-instruction"},
                               {name: "detail", classes: "wizard-instruction-detail"}
                        ]}
                    ]
                }
            ]
        },
        {name: "cancle", kind: "moon.Button", classes: "wizard-button-bottom", ontap: "cancleTap", content: "Cancle"}
    ],
    bindings: [
        {from: ".controller.title", to: ".title"}, 
        {from: ".controller.wizResults", to: ".$.header.$.wizListAction.$.listActionsContainer.$.wizList.controller"}
    ],
    rendered: function() {
        this.inherited(arguments);
        this.initialSetting();
        return true;
    },    
    initialSetting: function() {
        this.$.prev.addClass("wizard-hide");
        // popup
        this.$.header.addClass("wizard-hide"); // I'm waiting short header
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
        this.$.imgmenu.set("src", collection.at(idx).get("imgsrc")); 
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
        this.$.detail.set("content", collection.at(idx).get("detail")); 
        return true;
    },
    prevTap: function(inSender, inEvent) {
        this.actionListClose(); 
        this.doWizardStepChanged({cmd:"previous"});
        return true;
    },
    postTap: function(inSender, inEvent) {
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizResults");
        collection.at(idx).set("result", this.getSelectedText());
        collection.at(idx).set("processed", "[TRUE]");
        this.doWizardStepChanged({cmd:"next"});
        return true;
    },
    cancleTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"cancle"});
        return true;
    }
});
