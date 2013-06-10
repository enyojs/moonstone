enyo.kind({
    name: "moon.sample.wizard.FullScreenSample",
    classes: "moon",
    handlers: {
        onWizardStepChanged: "wizardStepChanged"
    },
    components: [
        {name: "wizpanels", kind: "moon.Panels", arrangerKind: "CarouselArranger", classes: "enyo-fill", 
            components: [
                {name: "introPage", kind: "moon.sample.wizard.FullScreenIntroSample"},
                {name: "stepPage1", kind: "moon.sample.wizard.FullScreenStepSample"},
                {name: "stepPage2", kind: "moon.sample.wizard.FullScreenStepSample"},
                {name: "stepPage3", kind: "moon.sample.wizard.FullScreenStepSample"},
                {name: "stepPage4", kind: "moon.sample.wizard.FullScreenStepSample"},
                {name: "confirmPage", kind: "moon.sample.wizard.FullScreenConfirmationSample"}  
        ]}
    ],
    bindings: [
        {from: ".controller", to: ".$.introPage.controller"},
        {from: ".controller", to: ".$.stepPage1.controller"},
        {from: ".controller", to: ".$.stepPage2.controller"},
        {from: ".controller", to: ".$.stepPage3.controller"},
        {from: ".controller", to: ".$.stepPage4.controller"},
        {from: ".controller", to: ".$.confirmPage.controller"}
    ],
    wizardStepChanged: function (sender, event) {
        var cmd = event.cmd;
        var n = this.$.wizpanels.getPanelIndex(event.originator);
        switch(cmd){
            case "previous":
                this.$.wizpanels.previous();
                break; 
            case "next":
                this.$.wizpanels.next();
                break;
            case "done":
                // TODO : done routine
                break;
            case "cancle":
                // TODO : cancle routine
                break;
            default:
        }
        console.log(cmd);
        return true;
    }
});
enyo.ready(function(){
    var wizardModel = new enyo.Model({
            title: "Wizard Title",
            wizContainer: new enyo.Collection([
                {
                    id: "01",
                    subtitle: "Step Title 1",
                    imgsrc: "assets/album.PNG",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE",
                    detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ipsum tortor,a       \
                             hendrerit urna. Integer eget faucibus purus. Nunc non arcu turpis, venenatis aliquam neque. In \
                             pulvinar lectus at orci fringilla eget consectetur arcu vulputate. Nullam sodales dui eu tellus\
                             interdum vel volutpat velit semper."
                },
                {   
                    id: "02",
                    subtitle: "Step Title 2",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 2",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 2"
                },
                {   
                    id: "03",
                    subtitle: "Step Title 3",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 3",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 3"
                },
                {   
                    id: "04",
                    subtitle: "Step Title 4",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 4",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 4"
                },
                {   
                    id: "05",
                    subtitle: "Step Title 5",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 5",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 5"
                },
                {   
                    id: "06",
                    subtitle: "Step Title 6",
                    imgsrc: "",
                    instruction: "Confirm your selections before complete",
                    detail: ""
                }
            ]),
            wizResults: new enyo.Collection([
                {step: "STEP TITLE 02 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 03 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 04 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 05 : ", result: " -- ", processed: "[FALSE]"}
            ])
        }
    );
    app = new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
                {kind: "enyo.Spotlight"},
                {
                    kind: "moon.sample.wizard.FullScreenSample",
                    controller: ".app.controllers.WizardController",
                    classes: "enyo-fit"
                }
            ]
        },
        controllers: [      
            {
                name: "WizardController",
                kind: "enyo.ModelController",
                model: wizardModel
            }
        ]
    }); 
});
