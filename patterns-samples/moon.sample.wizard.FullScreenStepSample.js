enyo.kind({
    name: "moon.sample.wizard.FullScreenStepSample",
    kind: "moon.Panel",
    classes: "moon-wizard-sample enyo-fit",
    layoutKind: "FittableRowsLayout",
    published:{
        selectedText: "",
        processed: false,
    },
    handlers: {
        onchange: "inputChanged"
    },
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
        {from: ".controller.title", to: ".title"}            
    ],
    initialSetting: function() {
        var idx = this.$.header.getTitleAbove()-1; // need to exchange
        var collection = this.controller.get("wizContainer");
        this.$.header.setTitleBelow(collection.at(idx).get("id") + ". " + collection.at(idx).get("subtitle"));    
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
        var idx = this.$.header.getTitleAbove()-2; // need to exchange
        var collection = this.controller.get("wizResults");
        this.setProcessed(true);
        collection.at(idx).set("result", this.getSelectedText());
        collection.at(idx).set("processed", "[TRUE]");
        this.doWizardStepChanged({cmd:"next"});
    },
    cancleTap: function(inSender, inEvent) {
        this.doWizardStepChanged({cmd:"cancle"});
    },    
    inputChanged: function(inSender, inEvent) {
        var result1 = this.$.intext1.getValue();
        var result2 = this.$.check1.getChecked();
        var result3 = this.$.check2.getChecked();
        var result4 = this.$.intext2.getValue();
        var result5 = this.$.intext3.getValue();
        var result6 = this.$.intext4.getValue();
        var result = result1 + ", ";
        result += result2 + ", ";
        result += result3 + ", ";
        result += result4 + ", ";
        result += result5 + ", ";
        result += result6;
        this.setSelectedText(result);
    }
});
