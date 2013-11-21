enyo.kind({
	name: "moon.Sample.Wizard.MiniSample",
	kind: "enyo.Application",
	view: "moon.Sample.Wizard.MiniPopup",
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
    name: "moon.Sample.Wizard.MiniPopup",
    classes: "moon enyo-unselectable",
    handlers: {
        ontap: "onTap"
    },
    components: [
        {kind: "moon.Divider", content: "Wizard Popup Sample"},
        {classes: "moon-hspacing", components: [
            {kind: "moon.Button", content: "Wizard Popup", ontap: "showPopup", popup: "wizPopup"}
        ]},
        {name: "wizPopup", kind: "moon.Popup", animate: false, spotlightModal: true, classes: "moon-12v", components: [
            {name: "wizardSample", kind: "moon.Sample.Wizard.MiniPanels", classes:"enyo-fill"}
        ]}
    ],
    showPopup: function(inSender) {
        this.$.wizPopup.show();
    },
    hidePopup: function() {
        this.$.wizPopup.hide();
    }
});

enyo.kind({
	name: "moon.Sample.Wizard.MiniPanels",
	kind: "moon.Panels",
	arrangerKind: "CardArranger",
	handlers: {
		onNext: "next",
		onPrevious: "previous",
		onCancel: "doCancel"
	},
	components: [
		{name: "page1", kind: "moon.Sample.Wizard.MiniPanel"},
		{name: "page2", kind: "moon.Sample.Wizard.MiniPanel"},
		{name: "page3", kind: "moon.Sample.Wizard.MiniPanel"},
		{name: "page4", kind: "moon.Sample.Wizard.MiniPanel"}
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
				this.getPanels()[this.index].setToEnd();
			}
		}
	},
	doCancel: function() {
		this.log("Cancel");
		return true;
	}
});