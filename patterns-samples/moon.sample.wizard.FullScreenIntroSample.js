enyo.kind({
    name: "moon.sample.wizard.FullScreenIntroSample",
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
        {from: ".controller.title", to: ".title"}         
    ],
    initialSetting: function() {
        this.$.prev.addClass("wizard-hide");
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));
        this.$.imgmenu.set("src", collection.at(idx).get("imgsrc")); 
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
        this.$.detail.set("content", collection.at(idx).get("detail")); 
    },
    rendered: function() {
        this.inherited(arguments);
        this.initialSetting();
    },
    prevTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"previous"});
    },
    postTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"next"});
    },
    cancleTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"cancle"});
    }
});
