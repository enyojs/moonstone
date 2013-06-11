enyo.kind({
    name: "moon.sample.wizard.FullScreenSample",
    kind: "moon.Panels",
    arrangerKind: "CarouselArranger",
    classes: "moon enyo-unselectable enyo-fit",
    handlers: {
        onWizardStepChanged: "wizardStepChanged",
    },
    components: [
        {name: "introPage", kind: "moon.sample.wizard.FullScreenIntroSample"},
        {name: "stepPage1", kind: "moon.sample.wizard.FullScreenStepSample"},
        {name: "stepPage2", kind: "moon.sample.wizard.FullScreenStepSample"},
        {name: "stepPage3", kind: "moon.sample.wizard.FullScreenStepSample"},
        {name: "stepPage4", kind: "moon.sample.wizard.FullScreenStepSample"},
        {name: "confirmPage", kind: "moon.sample.wizard.FullScreenConfirmationSample"}  
    ],
    bindings: [
        {from: ".controller", to: ".$.introPage.controller"},
        {from: ".controller", to: ".$.stepPage1.controller"},
        {from: ".controller", to: ".$.stepPage2.controller"},
        {from: ".controller", to: ".$.stepPage3.controller"},
        {from: ".controller", to: ".$.stepPage4.controller"},
        {from: ".controller", to: ".$.confirmPage.controller"}
    ],
    wizardStepChanged: function(iSender, iEvent) {
        var cmd = iEvent.cmd;
        switch(cmd) {
            case "previous":
                this.previous();
                break; 
            case "next":
                this.next();
                break;
            case "done":
                // TODO : done routine
                break;
            case "cancle":
                // TODO : cancle routine
                break;
            case "STEP TITLE 01":
            case "STEP TITLE 02":
            case "STEP TITLE 03":
            case "STEP TITLE 04":
            case "STEP TITLE 05":
            case "STEP TITLE 06":
                var collection = this.controller.get("wizResults");
                for (var index in collection) {
                    if(cmd == collection.at(index).get("step"))
                    {
                        this.setIndex(index);
                        break;
                    }
                }
                break;
            default:
        }
        return true;
    },
    onTap: function(oSender, oEvent) {
        //* override from panels
        // no action for Carosel Arranger using button        
        return true;
    }
});
enyo.ready(function(){
    var wizardModel = new enyo.Model({
            title: "Wizard Title",
            wizContainer: new enyo.Collection([
                {
                    id: "01",
                    subtitle: "STEP TITLE 01",
                    imgsrc: "assets/album.PNG",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE",
                    detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ipsum tortor,a       \
                             hendrerit urna. Integer eget faucibus purus. Nunc non arcu turpis, venenatis aliquam neque. In \
                             pulvinar lectus at orci fringilla eget consectetur arcu vulputate. Nullam sodales dui eu tellus\
                             interdum vel volutpat velit semper."
                },
                {   
                    id: "02",
                    subtitle: "STEP TITLE 02",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 2",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 2"
                },
                {   
                    id: "03",
                    subtitle: "STEP TITLE 03",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 3",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 3"
                },
                {   
                    id: "04",
                    subtitle: "STEP TITLE 04",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 4",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 4"
                },
                {   
                    id: "05",
                    subtitle: "STEP TITLE 05",
                    imgsrc: "",
                    instruction: "INSTRUCTIONAL TEXT GOES HERE 5",
                    detail: "INPUT FIELD DESCRIPTION GOES HERE 5"
                },
                {   
                    id: "06",
                    subtitle: "STEP TITLE 06",
                    imgsrc: "",
                    instruction: "Confirm your selections before complete",
                    detail: ""
                }
            ]),
            wizResults: new enyo.Collection([
                {step: "STEP TITLE 01", result: "-", processed: "[FALSE]"},
                {step: "STEP TITLE 02", result: "-", processed: "[FALSE]"},
                {step: "STEP TITLE 03", result: "-", processed: "[FALSE]"},
                {step: "STEP TITLE 04", result: "-", processed: "[FALSE]"},
                {step: "STEP TITLE 05", result: "-", processed: "[FALSE]"},
                {step: "STEP TITLE 06", result: "-", processed: "[FALSE]"}
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
