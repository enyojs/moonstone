enyo.kind({
	name: "moon.Sample.Wizard.FullScreenSample",
	kind: "moon.Panels",
	arrangerKind: "CardArranger",
	handlers: {
		onNext: "next",
		onPrevious: "previous",
		onCancel: "doCancel"
	},
	components: [
		{name: "introPage", kind: "moon.Sample.Wizard.Panel"},
		{name: "stepPage1", kind: "moon.Sample.Wizard.Panel"},
		{name: "stepPage2", kind: "moon.Sample.Wizard.Panel"},
		{name: "stepPage3", kind: "moon.Sample.Wizard.Panel"},
		{name: "stepPage4", kind: "moon.Sample.Wizard.Panel"},
		{name: "finalPage", kind: "moon.Sample.Wizard.Panel"}
	],
	bindings: [
		{from: ".controller", to: ".$.introPage.controller"},
		{from: ".controller", to: ".$.stepPage1.controller"},
		{from: ".controller", to: ".$.stepPage2.controller"},
		{from: ".controller", to: ".$.stepPage3.controller"},
		{from: ".controller", to: ".$.stepPage4.controller"},
		{from: ".controller", to: ".$.finalPage.controller"}
	],
	next: function() {
		this.inherited(arguments);
		if (this.index === this.getPanels().length - 1) {
			this.getPanels()[this.index].finalSetting();
		}
	},
	doCancel: function() {
		this.log("Cancel");
		return true;
	}
});

enyo.ready(function(){
	var wizardModel = new enyo.Model({
		title: "Wizard Title",
		wizContainer: new enyo.Collection([
			{
				subtitle: "Step Title 1",
				imgsrc: "../assets/album.PNG",
				instruction: "INSTRUCTIONAL TEXT GOES HERE",
				detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ipsum tortor,a " +
						"hendrerit urna. Integer eget faucibus purus. Nunc non arcu turpis, venenatis aliquam neque. In " +
						"pulvinar lectus at orci fringilla eget consectetur arcu vulputate. Nullam sodales dui eu tellus " +
						"interdum vel volutpat velit semper."
			},
			{
				subtitle: "Step Title 2",
				imgsrc: "",
				instruction: "INSTRUCTIONAL TEXT GOES HERE 2",
				detail: "INPUT FIELD DESCRIPTION GOES HERE 2"
			},
			{
				subtitle: "Step Title 3",
				imgsrc: "",
				instruction: "INSTRUCTIONAL TEXT GOES HERE 3",
				detail: "INPUT FIELD DESCRIPTION GOES HERE 3"
			},
			{
				subtitle: "Step Title 4",
				imgsrc: "",
				instruction: "INSTRUCTIONAL TEXT GOES HERE 4",
				detail: "INPUT FIELD DESCRIPTION GOES HERE 4"
			},
			{
				subtitle: "Step Title 5",
				imgsrc: "",
				instruction: "INSTRUCTIONAL TEXT GOES HERE 5",
				detail: "INPUT FIELD DESCRIPTION GOES HERE 5"
			},
			{
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
	});

	new enyo.Application({
		view: {
			classes: "enyo-unselectable moon",
			components: [
				{
					kind: "moon.Sample.Wizard.FullScreenSample",
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
