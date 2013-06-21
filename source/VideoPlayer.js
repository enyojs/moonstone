
/**
	_moon.VideoPlayer_ is a control that wraps an	<a href="#enyo.Video">enyo.Video</a>
	HTML5 video player to provide Moonstone-styled standard transport controls,
	optional app-specific controls, and an information bar for video information
	and player feedback.

	Client components added to the _components_ block are rendered into the video
	player's transport control area, and should generally be limited to instances
	of _moon.IconButton. If more than two are specified, they will be rendered
	into an "overflow" screen, reached by activating a button to the right of the
	controls.

	Example:

		{
			kind: "moon.VideoPlayer",
			src: "http://www.w3schools.com/html/mov_bbb.mp4",
			components: [
				// Custom icons for app-specific features
				{kind: "moon.IconButton", src: "assets/feature1.png", ontap: "feature1"},
				{kind: "moon.IconButton", src: "assets/feature2.png", ontap: "feature2"},
				{kind: "moon.IconButton", src: "assets/feature3.png", ontap: "feature3"}
			]
		}

*/

enyo.kind({
	name: "moon.VideoPlayer",
	kind: "enyo.Control",
	// Fixme: When enyo-fit is used than the background image does not fit to video while dragging.
	classes: "moon-video-player", 
	published: {
		//* HTML5 video source URL
		src: "",
		//* Video aspect ratio, set as width:height
		aspectRatio: "16:9",
		
	},
	handlers: {
		onRequestPlay: "play",
		onRequestPause: "pause",
		onRequestRewind: "rewind",
		onRequestFastForward: "fastForward",
		onRequestJumpBack: "jumpBack",
		onRequestJumpForward: "jumpForward",
		onRequestJumpToStart: "jumpToStart",
		onRequestJumpToEnd: "jumpToEnd",
		onRequestTimeChange: "timeChange",
		onToggleFullscreen: "toggleFullscreen"
	},
    bindings: [],
	defaultInfoOptions: {
		videoDateTime: new Date(),
		videoTitle: "Voice of Korea",
		videoDescription: "Description about the current show"
	},
	infoOptions: {},
	playerControls: [],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	_holdPulseThreadhold: 300,
	controlParentName: "fullscreenControls",
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video", isChrome: true,
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", onplay: "_play", onpause: "_pause"
		}
	],
	
	create: function() {
		this.inherited(arguments);
		this.createVideoPlayerControls();
		this.initializeInfoOptions();
		this.srcChanged();
		this.setupPlayerControlBindings();
	},
	createVideoPlayerControls: function() {
		this.createComponents(this.playerControls)
	},
	//* Mix _this.defaultInfoOptions_ and _this.infoOptions_
	initializeInfoOptions: function() {
		this.infoOptions = enyo.mixin(this.defaultInfoOptions, this.infoOptions);
		// TODO - there must be a better way to prep these to work with bindings...
		for (var prop in this.infoOptions) {
			this[prop] = this.infoOptions[prop];
		}
	},
	//* Return _this._playerControls_
	getPlayerControls: function() {
		return this.getClientControls();
	},
	//* Setup bindings for _this.infoOptions_ on all of _this.playerControls_
	setupPlayerControlBindings: function() {
		var controls = this.getPlayerControls(), i, j;
		for (i = 0; i < controls.length; i++) {
			for (prop in this.infoOptions) {
				this.bindings.push({from: "." + prop, to: ".$." + controls[i].name + "." + prop});
			}
		}
	},
	
	//* @public
	
	//* Toggle fullscreen on/off
	toggleFullscreen: function(inSender, inEvent) {
		if (this.isFullscreen()) {
			this.cancelFullscreen();
		} else {
			this.requestFullscreen();
		}
	},
	//* Facade _this.$.video.play_
	play: function(inSender, inEvent) {
		this.$.video.play();
	},
	//* Facade _this.$.video.pause_
	pause: function(inSender, inEvent) {
		this.$.video.pause();
	},
	//* Facade _this.$.video.rewind_
	rewind: function(inSender, inEvent) {
		this.$.video.rewind();
	},
	//* Facade _this.$.video.jumpToStart_
	jumpToStart: function(inSender, inEvent) {
		this.$.video.jumpToStart();
	},
	//* Facade _this.$.video.jumpBack_
	jumpBack: function(inSender, inEvent) {
		this.$.video.jumpBack();
	},
	//* Facade _this.$.video.fastForward_
	fastForward: function(inSender, inEvent) {
		this.$.video.fastForward();
	},
	//* Facade _this.$.video.jumpToEnd_
	jumpToEnd: function(inSender, inEvent) {
		this.$.video.jumpToEnd();
	},
	//* Facade _this.$.video.jumpForward_
	jumpForward: function(inSender, inEvent) {
		this.$.video.jumpForward();
	},
	//* Facade _this.$.video.setCurrentTime_
	setCurrentTime: function(inValue) {
		this.$.video.setCurrentTime(inValue);
	},


	//* @protected

	//* Responds to change in video source.
	srcChanged: function() {
		if (typeof this.src === "string" && this.src.length > 0 && this.$.video) {
			this.$.video.setSrc(this.src);
		}
	},
	
	//* Updates the video time.
	timeUpdate: function(inSender, inEvent) {
		this.waterfall("onTimeupdate", inEvent);
	},
	//* Called when video successfully loads video metadata
	metadataLoaded: function(inSender, inEvent) {
		this.updateAspectRatio();
	},
	//* Respond to _onRequestTimeChange_ event by setting current video time
	timeChange: function(inSender, inEvent) {
		this.setCurrentTime(inEvent.value);
	},
	//* Update the height/width based on the video's aspect ratio
	updateAspectRatio: function() {
		var node = this.hasNode(),
			videoAspectRatio = this.$.video.getAspectRatio().split(":"),
			ratio = 1
		;
		
		if (!node) {
			return;
		}
		
		// If height but no width defined, update width based on aspect ratio
		if (node.style.height && !node.style.width) {
			ratio = videoAspectRatio[0] / videoAspectRatio[1];
			this.applyStyle("width", ((parseInt(node.style.height, 10) * ratio)) + "px");
		// If width but no height defined, update height based on aspect ratio
		} else if (node.style.width && !node.style.height) {
			ratio = videoAspectRatio[1] / videoAspectRatio[0];
			this.applyStyle("height", ((parseInt(node.style.width, 10) * ratio)) + "px");
		}
	},

	///////// VIDEO EVENT HANDLERS /////////

	_play: function(inSender, inEvent) {
		this._isPlaying = true;
		this.playStateChanged();
	},
	_pause: function(inSender, inEvent) {
		this._isPlaying = false;
		this.playStateChanged();
	},
	playStateChanged: function() {
		this.addRemoveClass("playing", this._isPlaying);
		this.waterfall("onPlayStateChanged", {playing: this._isPlaying});
	}
});
