enyo.kind({
	name: "moon.PhotoSlideshow",
	kind: "enyo.Popup",
	classes: "moon-photo-slideshow",
	components: [
		//{name: "photo", kind: "enyo.Image", ontap: "tapHandler", classes: "moon-photo-slideshow-image"},
		{name: "photo", ontap: "tapHandler", classes: "moon-photo-slideshow-image"},
		{name: "slideControl", kind: "moon.PhotoSlideshowControl", onClose: "closeHandler", onChangeSlide: "changeSlideHandler"}
	],
	create: function() {
		this.inherited(arguments);
		
		// mockup data
		this.results = [{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"},
						{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "250", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"},
						{width: "300", height: "250", url: "../assets/breaking_bad.png"},
						{width: "250", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"}
					];
		this.$.slideControl.results = this.results;
		this.$.slideControl.setCount(this.results.length);
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideControl.toggleMinMax();
	},
	requestShow: function(inUrl) {
		// TODO: set inUrl as default image path when path is invalid
		this.$.photo.setSrc(inUrl);
		
		this.inherited(arguments);
	},
	closeHandler: function(inSender, inEvent) {
		this.requestHide();
		return true;
	},
	changeSlideHandler: function(inSender, inEvent) {
		this.$.photo.setSrc(this.results[inEvent.index].url);
		return true;
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
		listHeight: 160,	// height (px) of image list item
		index: 0,			// index number of image item
		count: 0			// count of image item
	},
	events: {
		onClose: "",
		onChangeSlide: ""
	},
	components: [
		{kind: "enyo.Spotlight"},
		{layoutKind: 'HFlexLayout', components: [
			{flex: true, classes:"moon-photo-slideshow-control-left-button", components: [
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "closeHandler"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "deleteActivated"}
			]},
			{content:"Item 1-2", classes: "moon-photo-slideshow-control-middle-button", components: [
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "prevHandler"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "playHandler"},
				{kind: "moon.IconButton", src: "../assets/trash-can-icon.png", ontap: "nextHandler"}
			]},
			{flex: true, components: [
				{kind: "moon.ExpandablePicker", content: "SlideShow Speed", style: "width:240px;", components: [
					{content: "Normal"},
					{content: "Orbiter", active: true}
				]}
			]}
		]},
		{name: "list", kind: "moon.List", orient:"h", count: 10, multiSelect: false, spotlight: true, 			onSetupItem: "setupItem", components: [
				{name: "item", kind: "enyo.Image", src: "../assets/album.png", classes: "moon-photo-slideshow-control-item"}
		]}

	],
	create: function() {
		this.inherited(arguments);
		var wh = enyo.dom.getWindowHeight();
		var controlH = 280;
		this.setBounds({top: wh - controlH, height: controlH}, "px");

		// mockup data
/*		this.results = [{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"},
						{width: "500", height: "300", url: "../assets/breaking_bad.png"},
						{width: "250", height: "400", url: "../assets/south_park.png"},
						{width: "500", height: "500", url: "../assets/paulie.png"},
						{width: "300", height: "300", url: "../assets/breaking_bad.png"},
						{width: "400", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"},
						{width: "300", height: "250", url: "../assets/breaking_bad.png"},
						{width: "250", height: "200", url: "../assets/south_park.png"},
						{width: "200", height: "200", url: "../assets/paulie.png"}
					];
*/
		this.$.list.applyStyle("height", (this.listHeight + 16 * 2 + 10) + "px");
		//this.$.list.setCount(this.results.length);
	},
	setupItem: function(inSender, inEvent) {
		// this is the row we're setting up
		var i = inEvent.index;
		var itemW = this.results[i].width;
		var itemH = this.results[i].height;
		var w2h = itemW/itemH;

		this.$.item.setAttribute("height", this.listHeight + "px");
		this.$.item.setAttribute("width", + w2h * this.listHeight + "px");
		this.$.item.setSrc(this.results[i].url);
	},
	countChanged: function() {
		this.$.list.setCount(this.count);
	},
	closeHandler: function(inSender, inEvent) {
		this.doClose({});
		return true;
	},
	prevHandler: function(inSender, inEvent) {
		if (this.index > 0) {
			this.index--;
			this.doChangeSlide({index: this.index});
		}		
		return true;
	},
	playHandler: function(inSender, inEvent) {
		return true;
	},
	nextHandler: function(inSender, inEvent) {
		if (this.index < (this.results.length-1)) {
			this.index++;
			this.doChangeSlide({index: this.index});
		}	
		return true;
	}
});