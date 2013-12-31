enyo.kind({
	name: "moon.Sample.Wizard.ActionMenuSample",
	kind: "enyo.Application",
	view: "moon.Sample.Wizard.ActionMenu",
	classes: "enyo-unselectable moon enyo-fit",
	components: [
		{name: "WizardController", kind: "moon.Sample.Wizard.Controller"}
	]
});

enyo.kind({
	name: "moon.Sample.Wizard.Model",
	kind: "enyo.Model",
	defaults: {
		title: "",
		subTitle: "",
		imgSrc: "../assets/album.PNG",
		instruction: "",
		detail: ""
	}
});

enyo.kind({
	name: "moon.Sample.Wizard.Controller",
	kind: "enyo.ModelController",
	create: function() {
		this.inherited(arguments);
		this.set("model", new enyo.Model(this.generateRecords()));
	},
	generateRecords: function() {
		return {
				page1 : new moon.Sample.Wizard.Model({
					title: "Wizard Title",
					subTitle: "01.Step Title 1",
					imgSrc: "../assets/album.PNG",
					instruction: "INSTRUCTIONAL TEXT GOES HERE",
					detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet ipsum tortor,a " +
							"hendrerit urna. Integer eget faucibus purus. Nunc non arcu turpis, venenatis aliquam neque. In " +
							"pulvinar lectus at orci fringilla eget consectetur arcu vulputate. Nullam sodales dui eu tellus " +
							"interdum vel volutpat velit semper."
				}),
				page2 : new moon.Sample.Wizard.Model({
					title: "Wizard Title",
					subTitle: "02.Step Title 2",
					imgSrc: "",
					instruction: "INSTRUCTIONAL TEXT GOES HERE 2",
					detail: "INPUT FIELD DESCRIPTION GOES HERE 2"
				}),
				page3 : new moon.Sample.Wizard.Model({
					title: "Wizard Title",
					subTitle: "03.Step Title 3",
					imgSrc: "../assets/album.PNG",
					instruction: "INSTRUCTIONAL TEXT GOES HERE 3",
					detail: "INPUT FIELD DESCRIPTION GOES HERE 3"
				}),
				page4 : new moon.Sample.Wizard.Model({
					title: "Wizard Title",
					subTitle: "04.Step Title 4",
					imgSrc: "",
					instruction: "Confirm your selections before complete",
					detail: ""
				})
			};
	}
});

enyo.kind({
	name: "moon.Sample.Wizard.ActionMenu",
	kind: "enyo.Panels",
	arrangerKind: "CardArranger",
	classes: "enyo-unselectable moon enyo-fit",
	handlers: {
		onNext: "next",
		onPrevious: "previous",
		onCancel: "doCancel"
	},
	components: [
		{name: "page1", kind: "moon.Sample.Wizard.ActionMenuPanel"},
		{name: "page2", kind: "moon.Sample.Wizard.ActionMenuPanel"},
		{name: "page3", kind: "moon.Sample.Wizard.ActionMenuPanel"},
		{name: "page4", kind: "moon.Sample.Wizard.ActionMenuPanel"}
	],
	bindings: [
		{from: ".collection.model.page1", to: ".$.page1.controller"},
		{from: ".collection.model.page2", to: ".$.page2.controller"},
		{from: ".collection.model.page3", to: ".$.page3.controller"},
		{from: ".collection.model.page4", to: ".$.page4.controller"}
	],
	create: function() {
		this.inherited(arguments);
		this.set("collection", new moon.Sample.Wizard.Controller());
	},
	rendered: function() {
		this.inherited(arguments);
		this.getPanels()[0].setToIntro();
	},
	next: function() {
		var panels = this.getPanels();
		if (this.index === panels.length - 1) {
			//exit Wizard
			return true;
		} else {
			this.inherited(arguments);
			if (this.index === panels.length - 1) {
				panels[this.index].setToEnd();
			}
		}
	},
	doCancel: function() {
		this.log("Cancel");
		return true;
	}
});