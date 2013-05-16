/**
	_moon.PhotoSlideshow_
*/
enyo.kind({
	name: "moon.PhotoSlideshow",
	kind: "enyo.Popup",
	classes: "moon-photo-slideshow",
	published: {
		//* The number of items contained in the list */
		count: 0
	},
	events: {
		/**
			Fires once per item at render time
			_inEvent.index_ contains the current list index
		*/
		onSetupItem: ""
	},

	//* @protected

	slideTools: [
		{name: "photo", ontap: "tapHandler", classes: "moon-photo-slideshow-image"},
		{name: "slideControl", kind: "moon.PhotoSlideshowControl", onClose: "closeHandler", onChangeSlide: "changeSlideHandler", onStartSlideshow: "startSlideshowHandler", onCompleteSlideshow: "completeSlideshowHandler"}
	],
    initComponents: function() {
    	this.createTools();
		this.controlParentName = "slideControl";
		this.discoverControlParent();
        this.inherited(arguments);
    },
    createTools: function() {
		this.createComponents(this.slideTools);
	},
	countChanged: function() {
		this.$.slideControl.setCount(this.count);
	},
	hide: function() {
		this.$.slideControl.stopSlideshow();
		this.inherited(arguments);
	},
	show: function() {
		this.$.slideControl.animateToMin();
		this.inherited(arguments);
	},
	tapHandler: function(inSender, inEvent) {
		this.$.slideControl.toggleMinMax();
	},
	closeHandler: function(inSender, inEvent) {
		this.requestHide();
		return true;
	},
	changeSlideHandler: function(inSender, inEvent) {
		this.$.photo.applyStyle("background-image", "url('" + this.$.slideControl.getImageUrl(inEvent.index) + "')");
		return true;
	},
	startSlideshowHandler: function(inSender, inEvent) {
		this.$.slideControl.animateToMax();
		return true;
	},
	completeSlideshowHandler: function(inSender, inEvent) {
		this.$.slideControl.animateToMin();
		return true;
	},

	//* @public

	//* Show PhotoSlideshow control after setting backgound image */
	requestShow: function() {
		var url = this.$.slideControl.getImageUrl(0);
		this.$.photo.applyStyle("background-image", "url('" + url + "')");

		this.inherited(arguments);
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
		//* Height (px) of thumbnail item */
		thumbHeight: 160,
		//* The number of items contained in the list */
		count: 0
	},
	events: {
		//* Fires when close button is tapped. */
		onClose: "",
		//* Fires when current image index is changed. */
		onChangeSlide: "",
		//* Fires when slideshow starts. */
		onStartSlideshow: "",
		//* Fires when slideshow ends. */
		onCompleteSlideshow: "",
		/**
			Fires once per item at render time
			_inEvent.index_ contains the current list index
			_inEvent.thumb_ contains the curren thumbnail
			_inEvent.image_ contains the curren image url
		*/
		onSetupItem: ""
	},

	//* @protected

	imageUrls: [],
	controlTools: [
		{kind: "enyo.Spotlight"},
		{layoutKind: 'HFlexLayout', components: [
			{name:"left", flex: true, kind: "FittableColumns", noStretch: true, classes:"moon-photo-slideshow-control-left-button", components: [
				{kind: "moon.IconButton", src: "../assets/fit-icon.png", ontap: "closeHandler"}
			]},
			{classes: "moon-photo-slideshow-control-middle-button", components: [
				{kind: "moon.IconButton", src: "../assets/icon_previous.png", ontap: "prevHandler", classes: "big-icon-button"},
				{name:"playpause", mode: "pause", kind: "moon.IconButton", src: "../assets/icon_play.png", ontap: "playHandler", classes: "big-icon-button"},
				{kind: "moon.IconButton", src: "../assets/icon_next.png", ontap: "nextHandler", classes: "big-icon-button"}
			]},
			{flex: true, components: [
				{name:"speed", kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "SLIDESHOW SPEED",
			classes: "moon-photo-slideshow-control-picker-wrapper", value: 3, min: 1, max: 15, unit: "sec", autoCollapse: true}
			]}
		]},
		{name: "list", kind: "moon.List", classes: "moon-photo-slideshow-control-list", orient:"h", multiSelect: false, spotlight: true, onSetupItem: "setupItem", onSpotlightSelect: "itemSelectHandler",
			components: [
				{name: "item", kind: "enyo.Image", src: "../assets/album.png", classes: "moon-photo-slideshow-control-item", ontap: "itemSelectHandler"
			}]
		}
	],
	create: function() {
		this.inherited(arguments);
		this.thumbHeightChanged();
		this.index = 0;
	},
    initComponents: function() {
    	this.createTools();
		this.controlParentName = "left";
		this.discoverControlParent();
        this.inherited(arguments);
    },
    createTools: function() {
		this.createComponents(this.controlTools);
	},
	setupItem: function(inSender, inEvent) {
		var thumb = {};
		var image = {};
		this.doSetupItem({index: inEvent.index, thumb: thumb, image: image});
		this.$.item.setSrc(thumb.src);
		if (thumb.width > 0) {
			var w2h = thumb.width / thumb.height;
			this.$.item.setAttribute("width", + w2h * this.thumbHeight + "px");
		}
		this.imageUrls[inEvent.index] = image.src;

		return true;
	},
	thumbHeightChanged: function() {
		this.$.item.setAttribute("height", this.thumbHeight + "px");
	},
	countChanged: function() {
		this.$.list.setCount(this.count);
	},
	closeHandler: function(inSender, inEvent) {
		this.doClose();
		return true;
	},
	prevHandler: function(inSender, inEvent) {
		this.stopSlideshow();

		if (this.index > 0) {
			this.index--;
			this.doChangeSlide({index: this.index, direction: "prev"});
		}
		return true;
	},
	playHandler: function(inSender, inEvent) {
		if (this.$.playpause.mode == "play") {
			this.stopSlideshow();
		}
		else {
			this.$.playpause.mode = "play";
			this.$.playpause.setSrc("../assets/icon_pause.png");

			// Slideshow will start from index[0] image
			this.index = (this.indexPause) ? this.indexPause : 0;
			this.doStartSlideshow({index: this.index});
			this.startJob("playSlideshow", "displaySlideImage", 0);
		}
		return true;
	},
	displaySlideImage: function() {
		this.doChangeSlide({index: this.index, direction: "none"});

		if (this.index < (this.count - 1)) {
			this.index++;
			this.startJob("playSlideshow", "displaySlideImage", this.$.speed.getValue() * 1000);
		}
		else {
			this.$.playpause.mode = "pause";
			this.$.playpause.setSrc("../assets/icon_play.png");
			this.doCompleteSlideshow({index: this.index});
		}
	},
	nextHandler: function(inSender, inEvent) {
		this.stopSlideshow();

		if (this.index < (this.count-1)) {
			this.index++;
			this.doChangeSlide({index: this.index, direction: "next"});
		}
		return true;
	},
	itemSelectHandler: function(inSender, inEvent) {
		this.stopSlideshow();

		if (inSender.kindName == 'moon.List') {
			this.index = enyo.Spotlight.Decorator.List._getCurrent(inSender);
		}
		else {
			this.index = inEvent.index;
		}

		this.doChangeSlide({index: this.index, direction: "none"});
		return true;
	},

	//* @public

	//* Stop slideshow play when playing slideshow */
	stopSlideshow: function() {
		this.$.playpause.mode = "pause";
		this.$.playpause.setSrc("../assets/icon_play.png");

		this.stopJob("playSlideshow");
		delete this.indexPause;
	},
	//* Return large image url */
	getImageUrl: function(inIndex) {
		if (this.imageUrls[inIndex]) {
			return this.imageUrls[inIndex];
		}

		return "";
	}
});
