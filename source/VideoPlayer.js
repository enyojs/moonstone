
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
		aspectRatio: "16:9"
		
	},
	handlers: {
		onRequestPlay: "play",
		onRequestPause: "pause",
		onRequestRewind: "rewind",
		onRequestFastForward: "fastForward",
		onRequestJumpBackward: "jumpBackward",
		onRequestJumpForward: "jumpForward",
		onRequestJumpToStart: "jumpToStart",
		onRequestJumpToEnd: "jumpToEnd",
		onRequestTimeChange: "timeChange",
		onToggleFullscreen: "toggleFullscreen",

		onloadstart:	"videoEventHandler",
		onemptied:	"videoEventHandler",
		oncanplaythrough:	"videoEventHandler",
		onended:	"videoEventHandler",
		onratechange:	"videoEventHandler",
		onprogress:	"videoEventHandler",
		onstalled:	"videoEventHandler",
		onplaying:	"videoEventHandler",
		ondurationchange:	"videoEventHandler",
		onvolumechange:	"videoEventHandler",
		onsuspend:	"videoEventHandler",
		onloadedmetadata:	"videoEventHandler",
		onwaiting:	"videoEventHandler",
		ontimeupdate:	"videoEventHandler",
		onabort:	"videoEventHandler",
		onloadeddata:	"videoEventHandler",
		onseeking:	"videoEventHandler",
		onplay:	"videoEventHandler",
		onerror:	"videoEventHandler",
		oncanplay:	"videoEventHandler",
		onseeked:	"videoEventHandler",
		onpause:	"videoEventHandler"
	},
    bindings: [],
	
	//* @protected

	_isPlaying: false,
	_autoCloseTimer: null,
	_holdPulseThreadhold: 300,
	_playerControls: [],
	
	components: [
		{name: "video", kind: "enyo.Video", classes: "moon-video-player-video",
			ontimeupdate: "timeUpdate", onloadedmetadata: "metadataLoaded", onprogress: "_progress"
		},
		{name: "client", kind: "moon.VideoControl.Fullscreen", playerControl: true},
		{kind: "moon.VideoControl.Inline", playerControl: true}
	],
	
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.setupPlayerControlBindings();
	},
	videoEventHandler: function(inSender, inEvent) {
		// To see video event uncomment below
		//this.log(inEvent.type, inEvent.timeStamp);
	},
	//* Return _this._playerControls_
	getPlayerControls: function() {
		var controls = this.children,
			returnControls = []
		;
		for (var i = 0; i < controls.length; i++) {
			if (controls[i].playerControl) {
				returnControls.push(controls[i]);
			}
		}
		return returnControls;
	},
	//* Setup bindings for all player controls
	setupPlayerControlBindings: function() {
		var controls = this.getPlayerControls();
		for (var i = 0; i < controls.length; i++) {
			this.bindings.push({from: ".videoDateTime", 		to: ".$." + controls[i].name + ".videoDateTime"});
			this.bindings.push({from: ".videoTitle", 			to: ".$." + controls[i].name + ".videoTitle"});
			this.bindings.push({from: ".videoDescription", 		to: ".$." + controls[i].name + ".videoDescription"});
			this.bindings.push({from: ".videoChannel", 			to: ".$." + controls[i].name + ".videoChannel"});
			this.bindings.push({from: ".videoSubtitleLanguage", to: ".$." + controls[i].name + ".videoSubtitleLanguage"});
			this.bindings.push({from: ".videoDisplayMode", 		to: ".$." + controls[i].name + ".videoDisplayMode"});
			this.bindings.push({from: ".videoTimeRecorded", 	to: ".$." + controls[i].name + ".videoTimeRecorded"});
			this.bindings.push({from: ".video3d", 				to: ".$." + controls[i].name + ".video3d"});
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
		this.playStateChanged("play");
	},
	//* Facade _this.$.video.pause_
	pause: function(inSender, inEvent) {
		this.$.video.pause();
		this.playStateChanged("pause");
	},
	//* Facade _this.$.video.rewind_
	rewind: function(inSender, inEvent) {
		this.$.video.rewind();
		this.playStateChanged("rewind");
	},
	//* Facade _this.$.video.jumpToStart_
	jumpToStart: function(inSender, inEvent) {
		this.$.video.jumpToStart();
		this.playStateChanged("jumpToStart");
	},
	//* Facade _this.$.video.jumpBackward_
	jumpBackward: function(inSender, inEvent) {
		this.$.video.jumpBackward();
		this.playStateChanged("jumpBackward");
	},
	//* Facade _this.$.video.fastForward_
	fastForward: function(inSender, inEvent) {
		this.$.video.fastForward();
		this.playStateChanged("fastForward");
	},
	//* Facade _this.$.video.jumpToEnd_
	jumpToEnd: function(inSender, inEvent) {
		this.$.video.jumpToEnd();
		this.playStateChanged("jumpToEnd");
	},
	//* Facade _this.$.video.jumpForward_
	jumpForward: function(inSender, inEvent) {
		this.$.video.jumpForward();
		this.playStateChanged("jumpForward");
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
		this.resized();
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


	_progress: function(inSender, inEvent) {
		this.waterfall("onBufferStateChanged", inEvent);
	},
	playStateChanged: function(command) {
		this._isPlaying = (command === "play" || command === "jumpForward" || command === "jumpBackward") ? true : false;
		this.waterfall("onPlayStateChanged", {
			playing: this._isPlaying, 
			command: command, 
			playbackRate: this.$.video._playbackRate
		});
	}
});
