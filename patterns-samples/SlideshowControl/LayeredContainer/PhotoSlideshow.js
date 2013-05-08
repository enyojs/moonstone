enyo.kind({
	name: "moon.PhotoSlideshow",
	kind: "enyo.Popup",
	classes: "moon-photo-slideshow",
	published: {
		//sortAction: null,
	},
	components: [
		{name: "photo", kind: "enyo.Image", ontap: "tapHandler", classes: "moon-photo-slideshow-image"},
		{name: "slideControl", kind: "moon.PhotoSlideshowControl", onClose: "closeHandler"}
	],
	create: function() {
		this.inherited(arguments);
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideControl.toggleMinMax();
	},
	requestShow: function(inSender, inEvent) {
		this.$.photo.setSrc("../assets/the-lorax-pic08.jpg");
		this.inherited(arguments);
	},
	closeHandler: function(inSender, inEvent) {
		this.requestHide();
	}
});


enyo.kind({
	name: "moon.PhotoSlideshowControl",
	kind: "enyo.Slideable",
	classes: "moon-photo-slideshow-control",
	axis: "v",
	unit: "%",
	min: 0,
	max: 100,
	published: {
		controlHeight: 160	// height of Slideshow control
	},
	events: {
		onClose:""
	},
	components: [
		{kind: "enyo.Spotlight"},
		{content:"Item 1", kind: "enyo.FittableColumns", components: [
			//{content:"Item 1-1"},
			{name: "object", classes: "slideshow-control-left", components: [
				{kind: "moon.IconButton", classes:"slideshow-control-left-button", src: "../assets/trash-can-icon.png", ontap: "closeHandler"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"}
			]},

			{content:"Item 1-2", fit: true},
			{content:"Item 1-3"}
		]},
		{style: "margin: 20px;"},

		{name: "list", kind: "moon.List", orient:"h", count: 10, multiSelect: false, spotlight: true, classes: "moon-slideshow-control-list moon-slideshow-control",
			onSetupItem: "setupItem", components: [
				{name: "item", kind: "enyo.Image", src: "../assets/album.png", classes: "slideshow-control-item"}
		]}

	],
	create: function() {
		this.inherited(arguments);
		var wh = enyo.dom.getWindowHeight();
		var sh = 280;
		this.setBounds({top: wh - sh, height: sh}, "px");

		// mockup data
		this.results = [{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"},
						{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"}
					];

		this.$.list.applyStyle("height", (this.controlHeight + 16 * 2 + 10) + "px");
		this.$.list.setCount(this.results.length);
	},
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		var itemW = this.results[i].width;
		var itemH = this.results[i].height;
		var w2h = itemW/itemH;

		this.$.item.setAttribute("height", this.controlHeight + "px");
		this.$.item.setAttribute("width", + w2h * this.controlHeight + "px");
		this.$.item.setSrc(this.results[i].url);
	},
	closeHandler: function(inSender, inEvent) {
		this.doClose({});
	}
});