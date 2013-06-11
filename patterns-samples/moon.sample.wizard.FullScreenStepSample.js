enyo.kind({
    name: "moon.sample.wizard.FullScreenStepSample",
    kind: "moon.Panel",
    classes: "moon-wizard-sample enyo-fit",
    layoutKind: "FittableRowsLayout",
    published:{
        selectedText: ""
    },
    handlers: {
        onchange: "inputChanged",
        ontap: "onTap"
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
                    classes: "step-window",
                    components: [
                        {name: "headline", classes: "wizard-instruction"},
                        {                            
                            components: [
                                {name: "indeco1", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
                                    {name: "intext1", kind: "moon.Input", placeholder: "INPUT FIELD 01"}
                                ]},
                                {name: "check1", kind: "moon.CheckboxItem", classes: "wizard-check-inline", content: "OPTION 1"},
                                {name: "check2", kind: "moon.CheckboxItem", classes: "wizard-check-inline",content: "OPTION 2"}
                            ]
                        },
                        {name: "indeco2", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
                            {name: "intext2", kind: "moon.Input", placeholder: "INPUT FIELD 02"}
                        ]},
                        {tag: "br"},
                        {tag: "br"},
                        {
                            components: [
                                {name: "detail", classes: "wizard-instruction"},
                                {name: "indeco3", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
                                    {name: "intext3", kind: "moon.Input", placeholder: "INPUT FIELD 03"}
                                ]},
                                {tag:"br"},
                                {name: "indeco4", kind: "moon.InputDecorator", classes: "wizard-input-decorator", components: [
                                    {name: "intext4", kind: "moon.Input", placeholder: "INPUT FIELD 04"}
                                ]}
                            ]
                        }
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
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));    
        this.$.headline.set("content", collection.at(idx).get("instruction")); 
        this.$.detail.set("content", collection.at(idx).get("detail"));    
        return true;  
    },
    prevTap: function(inSender, inEvent) {  
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizResults");
        this.actionListClose(); 
        collection.at(idx).set("result", " -- ");
        collection.at(idx).set("processed", "[FALSE]");
        
        this.doWizardStepChanged({cmd:"previous"});
        return true;
    },
    postTap: function(inSender, inEvent) {
        var idx = this.$.header.getTitleAbove()-1;
        var collection = this.controller.get("wizResults");
        this.actionListClose(); 
        collection.at(idx).set("result", this.getSelectedText());
        collection.at(idx).set("processed", "[TRUE]");

        this.doWizardStepChanged({cmd:"next"});
        return true;
    },
    cancleTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"cancle"});
        return true;
    },
    // For Actions Menu
    onTap: function(inSender, inEvent) {
        var content = inEvent.originator.content;
        if(inSender.kind=="moon.Header" && content != "" && this.$.header.$.wizListAction.getOpen())
        {
            var idx = this.$.header.getTitleAbove()-1;
            var collection = this.controller.get("wizResults");
            this.actionListClose(); 
            this.doWizardStepChanged({cmd:content}); 
        }
        return true;
    },
    actionListClose: function() {
        if(this.$.header.$.wizListAction.getOpen())
        {
            this.$.header.$.wizListAction.setOpen(false);
            enyo.Spotlight.spot(this.$.header.$.wizListAction.$.activator);
        }         
    },
    inputChanged: function(inSender, inEvent) {
        var result1 = this.$.intext1.getValue();
        var result2 = this.$.check1.getChecked();
        var result3 = this.$.check2.getChecked();
        var result4 = this.$.intext2.getValue();
        var result5 = this.$.intext3.getValue();
        var result6 = this.$.intext4.getValue();
        var result = " : "; 
        result += result1 + ", ";
        result += result2 + ", ";
        result += result3 + ", ";
        result += result4 + ", ";
        result += result5 + ", ";
        result += result6;
        this.setSelectedText(result);
        return true;
    }
});
