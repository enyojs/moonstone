enyo.kind({
	name: "moon.sample.slideshow.LayeredSample",
	classes: "slideshow-layered-sample enyo-unselectable",
	components: [
		{kind: "moon.Divider", content: "Click Image!"},
		{
			components: [
				{
					kind: "moon.ImageItem",
					source: "../assets/breaking_bad.png",
					label: "Breaking Bad",
					text: "A struggling high school chemistry teacher who is diagnosed with inoperable lung cancer turns to a life of crime, producing and selling methamphetamine with a former student",
					ontap: "tapHandler"
				}
			]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.createComponent({name: "slideShow", kind:"moon.sample.slideshow.PhotoSlideshow"});
		this.$.slideShow.render();
		this.$.slideShow.requestShow();// test
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideShow.requestShow();
	}
});

enyo.kind({
	name: "moon.sample.slideshow.PhotoSlideshow",
	kind: "moon.PhotoSlideshow"
/*	components: [
		{}
	]*/
});

/*enyo.kind({
	name: "moon.pattern.LayeredContainer",
	fit: true,
	kind: "enyo.FittableRows",
	classes: "enyo-unselectable multi-select-and-filter-pattern moon",
	published: {
		//sortAction: null,
	},
	components: [
		{name: "photo", kind: "enyo.Image", src: "../assets/the-lorax-pic08.jpg", ontap: "tapHandler"},
		{name: "slideControl", kind: "enyo.PhotoSlideshow"}
	],
	create: function() {
		this.inherited(arguments);
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideControl.toggleMinMax();
	}
});


enyo.kind({
	name: "enyo.PhotoSlideshow",
	kind: "enyo.Slideable",
//	layoutKind: "enyo.FittableRowsLayout",
	axis: "v", 
	unit: "%", 
	min: 0, 
	max: 100,
	classes: "enyo-photo-slideshow",
	published: {
		index: 0,
		pageSize: 3
	},
	components: [
		{kind: "enyo.Spotlight"},
		{content:"Item 1", kind: "enyo.FittableColumns", components: [
			//{content:"Item 1-1"},
			{name: "object", classes: "slideshow-control-left", components: [
				{kind: "moon.IconButton", classes:"slideshow-control-left-button", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"}
			]},				
			
			{content:"Item 1-2", fit: true},
			{content:"Item 1-3"}
		]},		
		{style: "margin: 20px;"},

		{name: "list", kind: "moon.List", orient:"h", count: 200, multiSelect: false, spotlight: true, classes: "moon-slideshow-control-list moon-slideshow-control",
			onSetupItem: "setupItem", components: [
				//{name: "item", classes: "slideshow-control-item"}
				{name: "item", kind: "enyo.Image", src: "../assets/album.png", classes: "slideshow-control-item"}
			/*{name: "item", classes: "list-horizontal-sample-item enyo-border-box", components: [
				{name: "index", classes: "list-sample-index"},
				//{name: "photo", kind: "enyo.Image", style:"width:250px;height:200px;", src: "../assets/album.png", ontap: "tapHandler"}
			]}*/
/*		]}

	],
	names: [],
	setupItem: function(inSender, inEvent) {
//		this.$.item.applyStyle("width", "240px");
//		this.$.item.applyStyle("height", "160px");
		
		this.$.item.setAttribute("width", "240px");
		this.$.item.setAttribute("height", "160px");
	
		/* global makeName */
		// this is the row we're setting up
/*		var i = inEvent.index;
		this.$.item.addRemoveClass("slideshow-control-selected", inSender.isSelected(i));

	},

	create: function() {
		this.inherited(arguments);
		var wh = enyo.dom.getWindowHeight();
		var sh = 280;
		this.setBounds({top: wh - sh, height: sh}, "px");
	}
});*/