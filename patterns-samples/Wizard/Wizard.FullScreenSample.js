enyo.kind({
	name: "Sample.Wizard.Panels",
	kind: "moon.Panels",
	defaultKind: "Sample.Wizard.Panel",
	arrangerKind: "CarouselArranger",
	classes: "moon enyo-unselectable enyo-fit",
    handlers: {
		onNext: "next",
		onPrevious: "previous",
		onCancel: "goCancel"
    },
	goCancel: function() {
		this.log("Cancel");
		return true;
	}
});

enyo.kind({
	name: "Sample.Wizard.Panel",
	kind: "moon.Panel",
	classes: "moon-wizard-sample enyo-fit",
    published: {
        selectedText: "",
        processed: false
    },
    events: {
		onNext: "",
		onPrevious: "",
		onCancel: ""
    },
    bindings: [
        {from: ".controller.title", to: ".title"}         
    ],
    rendered: function() {
        this.inherited(arguments);
        this.initialSetting();
    },
    initialSetting: function() {
    	// Stub
    }
});

enyo.kind({
    name: "moon.sample.wizard.FullScreenSample",
    kind: "Sample.Wizard.Panels",
    components: [
        {name: "introPage",   kind: "moon.sample.wizard.IntroPageSample"},
        {name: "stepPage1",   kind: "moon.sample.wizard.StepPageSample"},
        {name: "stepPage2",   kind: "moon.sample.wizard.StepPageSample"},
        {name: "stepPage3",   kind: "moon.sample.wizard.StepPageSample"},
        {name: "stepPage4",   kind: "moon.sample.wizard.StepPageSample"},
        {name: "confirmPage", kind: "moon.sample.wizard.ConfirmPageSample"}  
    ],
    bindings: [
        {from: ".controller", to: ".$.introPage.controller"},
        {from: ".controller", to: ".$.stepPage1.controller"},
        {from: ".controller", to: ".$.stepPage2.controller"},
        {from: ".controller", to: ".$.stepPage3.controller"},
        {from: ".controller", to: ".$.stepPage4.controller"},
        {from: ".controller", to: ".$.confirmPage.controller"}
    ],
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
                    subtitle: "Step Title 1",
                    imgsrc: "../assets/album.PNG",
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
                {step: "STEP TITLE 01 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 02 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 03 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 04 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 05 : ", result: " -- ", processed: "[FALSE]"},
                {step: "STEP TITLE 06 : ", result: " -- ", processed: "[FALSE]"}
            ])
        }
    );
	
    var app = new enyo.Application({
        view: {
            classes: "enyo-unselectable moon",
            components: [
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
