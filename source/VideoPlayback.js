
/**
	_moon.VideoPlayback_ is a control that 

		{kind: "moon.Slider", value: 30}

*/
enyo.kind({
	name: "moon.VideoPlayback",
	kind: "enyo.Control",
	classes: "moon-video-playback",
	spotlight: true,
	published: {
		//* Position of slider, expressed as an integer between 0 and 100,
		//* inclusive
		src: "",
		width: 640,
		height: 360,
		autoCloseTimeout: 2,
		infoComponents: [],	// defining component block for Video Details
	},
	//* @protected
	handlers: {
		onUpdate: "onUpdateHandler",
		onmove: "onMoveHandler",
		ontap: "checkShowHide",
		onSpotlightDown: "checkShowHide",
		onSpotlightUp: "checkShowHide",
		onSpotlightLeft: "checkShowHide",
		onSpotlightRight: "checkShowHide",
		onSpotlightDown: "checkShowHide",
		ondrag: "checkShowHide"
	},
	autoCloseTimer: null,
	controlTools: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-playback-video", ontimeupdate:"timeupdate"},
		{name: "videoInfoHeader", layoutKind: "FittableColumnsLayout", classes: "moon-video-playback-header", components: [
			{name: "videoInfo", fit: true, classes: "moon-video-playback-detail"},
			{name: "feedbackHeader", classes: "moon-video-playback-feedback", components: [
				{name: "feedback", classes: "moon-video-playback-feedback-icon"}
			]}
		]},
		{name: "playbackControl", layoutKind: "FittableRowsLayout", classes: "moon-video-playback-bottom", components: [
			{name: "controls", layoutKind: "FittableColumnsLayout", fit: true, components: [
				{components: [
					{name: "leftPremiumPlaceHolder", kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_previous.png",  classes: "moon-video-playback-controller-button"},
				]},
				{name: "controller", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-playback-controller", components: [
					{name: "trickPlay", layoutKind: "FittableColumnsLayout", noStretch: true, classes: "enyo-center", components: [
						{kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_previous.png", ontap: "jumpBackHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_previous.png", ontap: "rewindHandler", classes: "moon-video-playback-controller-button"},
						{name:"playpause", mode: "pause", kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_play.png", ontap: "playpauseHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_next.png", ontap: "fastForwardHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_next.png", ontap: "jumpForwardHandler", classes: "moon-video-playback-controller-button"}
					]},
					{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
				]},
				{components: [
					{name: "more", kind: "moon.IconButton", src: "../SlideshowControl/assets/icon_previous.png",  ontap: "tapHandler", classes: "moon-video-playback-controller-button"}
				]}
			]},
			{classes: "moon-video-playback-slider-container", onenter: "onEnterSlider", onleave: "onLeaveSlider", components: [
				{name: "slider", kind: "moon.VideoPlayerSlider", classes:"moon-video-playback-slider"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.widthChanged();
		this.heightChanged();
	},
	initComponents: function() {
		this.createTools();
		this.createVideoInfo();
		this.controlParentName = "client";
		this.discoverControlParent();
        this.inherited(arguments);
		// this.hideLayer();
	},
	createTools: function() {
		this.createComponents(this.controlTools);
	},
	createVideoInfo: function() {
		this.controlParentName = "videoInfo";
		this.discoverControlParent();
		this.createComponents(this.infoComponents);
	},
	srcChanged: function() {
		if (typeof this.src === "string" && this.src.length > 0) {
			this.$.video.setSrc(this.src);

			var p = this.controlParent;
			this.controlParent = undefined;
			this.$.slider.setVideo(this.$.video);
			this.controlParent = p;

		}
	},
	widthChanged: function() {
		this.$.video.setWidth(this.width);
		this.$.video.setAttribute("width", this.width + "px");
	},
	heightChanged: function() {
		this.$.video.setHeight(this.height);
		this.$.video.setAttribute("height", this.height + "px");
	},
	timeupdate: function(inSender, inEvent) {
		var val = (inSender.getCurrentTime() / inSender.getDuration())*100;
		if (!this.$.slider.dragging) {
			this.$.slider.setValue(val);
		}
		return true;
	},

	//* @public

	tapHandler: function(inSender, inEvent) {
		var index = this.$.controller.getIndex();
		if (index === 0) {
			this.$.controller.next();
		}
		else {
			this.$.controller.previous();
		}
	},
	playpauseHandler: function(inSender, inEvnet) {
		if (this.$.video.isPaused()) {
			this.$.video.play();
		}
		else {
			this.$.video.play();
		}
	},
	rewindHandler: function(inSender, inEvnet) {
		this.$.video.rewind();
	},
	jumpBackHandler: function(inSender, inEvnet) {
		this.$.video.jumpBack();
	},
	fastForwardHandler: function(inSender, inEvnet) {
		this.$.video.fastForward();
	},
	jumpForwardHandler: function(inSender, inEvnet) {
		this.$.video.jumpForward();
	},
	onUpdateHandler: function(inSender, inEvent) {
		if (inEvent.paused) {
			this.$.playpause.setSrc("../SlideshowControl/assets/icon_play.png");
		}
		else {
			this.$.playpause.setSrc("../SlideshowControl/assets/icon_pause.png");
		}
		return true;
	},
	hideLayer: function(inSender, inEvent) {
		this.$.videoInfoHeader.setShowing(false);
		this.$.playbackControl.setShowing(false);
	},
	onMoveHandler: function(inSender, inEvent) {
		var bDirty = false;
		if (this.$.videoInfoHeader.getShowing() == false) {
			this.$.videoInfoHeader.show();
			bDirty = true;
		}
		if (this.$.playbackControl.getShowing() == false) {
			this.$.playbackControl.show();
			bDirty = true;
		}
		if (bDirty == true) {
			this.resized();
		}
		this.resetAutoCloseTimer();
		// this.autoCloseTimer = setTimeout(enyo.bind(this, function() { 			
		// 		this.hideLayer();
		// 	}), this.getAutoCloseTimeout() * 1000);
		return true;
	},
	checkShowHide: function(inSender, inEvent) {
		if (inSender.name == "video") {
			this.hideLayer();
		} else {
			this.resetAutoCloseTimer();
			// this.autoCloseTimer = setTimeout(enyo.bind(this, function() { 			
			// 		this.hideLayer();
			// 	}), this.getAutoCloseTimeout() * 1000);
		}
	},
	resetAutoCloseTimer: function() {
		if (this.autoCloseTimer != null) {
			clearTimeout(this.autoCloseTimer);
		}
	},
	onEnterSlider: function() {
		this.$.controls.setShowing(false);
	},
	onLeaveSlider: function() {
		this.$.controls.show();
		this.$.controls.resized();
	}

});
