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
		height: 360
	},
	events: {
	// 	//* Fires when bar position is set. The _value_ property contains the
	// 	//* new position.
	// 	onChange: "",
	},
	//* @protected
	handlers: {
	// 	ondragstart: "dragstart",
	// 	onSpotlightFocus: "spotFocus",
		onUpdate: "onUpdateHandler"
	},
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-playback-video", ontimeupdate:"timeupdate"},
		/** Dummy header styling */
		{name: "header", layoutKind: "FittableColumnsLayout", classes: "moon-video-playback-header", components: [
			{name: "details", fit: true, classes: "moon-video-playback-details", components: [
				{style: "padding: 15px;", components: [
					{name: "titleAbove", classes: "moon-video-playback-header-datetime", content: "CURRENT DATE & TIME"},
					{name: "showname", classes: "moon-video-playback-header-showname", content: "SHOW NAME"},
					{name: "channel", classes: "moon-video-playback-header-channel", content: "CHANNEL - AIR DATE & TIME SLOT"},
					{name: "synopsys", classes: "moon-video-playback-header-synopsys", content: "SHORT SYNOPSYS ABOUT THE CURRENT SHOW"}
				]},
				{style: "padding: 15px; position: absolute; right: 0px; top: 0px;", components: [
					{content: "SUB ENGLISH", classes: "moon-video-playback-details-icon"},
					{content: "CINEMA", classes: "moon-video-playback-details-icon"},
					{content: "3D", classes: "moon-video-playback-details-icon"},
					{content: "REC 00:00", classes: "moon-video-playback-details-icon moon-video-playback-details-redicon"}
				]}
			]},
			{name: "feedback", classes: "moon-video-playback-feedback", components: [
				{content: "300x", classes: "moon-video-playback-feedback-icon"}
			]}
		]},
		{name: "bottom", layoutKind: "FittableRowsLayout", classes: "moon-video-playback-bottom", components: [
			{name: "controls", layoutKind: "FittableColumnsLayout", fit: true, components: [
				{components: [
					{name: "leftPremiumPlaceHolder", kind: "moon.IconButton", src: "assets/icon_previous.png",  classes: "moon-video-playback-controller-button"},
				]},
				{name: "controller", kind: "Panels", arrangerKind: "CarouselArranger", fit: true, draggable: false, classes: "moon-video-playback-controller", components: [
					{name: "trickPlay", layoutKind: "FittableColumnsLayout", noStretch: true, classes: "enyo-center", components: [
						{kind: "moon.IconButton", src: "assets/icon_previous.png", ontap: "jumpBackHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "assets/icon_previous.png", ontap: "rewindHandler", classes: "moon-video-playback-controller-button"},
						{name:"playpause", mode: "pause", kind: "moon.IconButton", src: "assets/icon_play.png", ontap: "playpauseHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "assets/icon_next.png", ontap: "fastForwardHandler", classes: "moon-video-playback-controller-button"},
						{kind: "moon.IconButton", src: "assets/icon_next.png", ontap: "jumpForwardHandler", classes: "moon-video-playback-controller-button"}
					]},
					{name: "client", layoutKind: "FittableColumnsLayout", classes: "enyo-center", noStretch: true}
				]},
				{components: [
					{name: "more", kind: "moon.IconButton", src: "assets/icon_previous.png",  ontap: "tapHandler", classes: "moon-video-playback-controller-button"}
				]}
			]},
			{classes: "moon-video-playback-slider-container", components: [
				{name: "slider", kind: "moon.PreviewSlider", classes:"moon-video-playback-slider"/*,  ondragstart: "previewDrag", onChange: "sliderChanged"*/}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		
		this.srcChanged();
		this.widthChanged();
		this.heightChanged();

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

		return true;
	},
	playpauseHandler: function(inSender, inEvnet) {
		if (this.$.video.isPaused()) {
			this.$.video.play();
		}
		else {
			this.$.video.play();
		}
		return true;
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
			this.$.playpause.setSrc("assets/icon_play.png");
		}
		else {
			this.$.playpause.setSrc("assets/icon_pause.png");
		}
	}

});
